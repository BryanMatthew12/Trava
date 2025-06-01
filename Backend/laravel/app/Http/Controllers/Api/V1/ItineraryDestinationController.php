<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ItineraryDestination;
use App\Http\Requests\StoreItineraryDestinationRequest;
use App\Http\Requests\UpdateItineraryDestinationRequest;
use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\Itinerary;
use App\Models\Places;
use App\Models\Threads;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ItineraryDestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($userId)
    {
        $itineraries = Itinerary::with('destinations')
        ->where('user_id', $userId)
        ->get();

    return response()->json($itineraries);
        // return ItineraryDestination::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /** 
     * Store a newly created resource in storage.
     */
    public function store(StoreItineraryDestinationRequest $request)
    {
        try {
            Log::info('ItineraryDestinationController@store called');
            $validated = $request->validated();
            Log::info('Validated Data: ', $validated);

            $itinerary = Itinerary::findOrFail($validated['itinerary_id']);
            Log::info('Itinerary Found: ', ['itinerary_id' => $itinerary->itinerary_id]);

            // $destinationId = $itinerary->destinations()->first()->destination_id ?? null;

            foreach ($validated['destinations'] as $destinationData) {
                Log::info('Processing Destination: ', $destinationData);

                // Use the provided day_id if it exists, otherwise create/find the day
                $dayId = $destinationData['day_id'] ?? null;
                if (!$dayId) {
                    $day = Day::firstOrCreate(
                        [
                            'itinerary_id' => $validated['itinerary_id'],
                            'day_number' => $destinationData['day_number'],
                        ],
                        [
                            'itinerary_id' => $validated['itinerary_id'],
                            'day_number' => $destinationData['day_number'],
                        ]
                    );
                    $dayId = $day->day_id;
                    Log::info('Day Created or Found: ', ['day_id' => $dayId]);
                }

                // If place_name is not provided in the request, get it from the Place model
                $place = Places::find($destinationData['place_id']);
                $placeName = $place ? $place->place_name : 'Unknown Place';

                ItineraryDestination::create([
                    'itinerary_id' => $validated['itinerary_id'],
                    'place_id' => $destinationData['place_id'],
                    'day_id' => $destinationData['day_id'], // Use the correct day_id
                    'destination_id' => $validated['destination_id'],
                    'place_name' => $placeName,
                    'place_rating' => $place->place_rating ?? null,
                    'place_image' => $place->place_image ?? null,
                    'place_description' => $place->place_description ?? null,
                    'visit_order' => $destinationData['visit_order'],
                    'est_price' => $destinationData['est_price'] ?? null,
                ]);
                // Log::info('Itinerary Destination Created: ', $destinationData);
            }

            return response()->json(['message' => 'Itinerary Destination Created'], 201);
        } catch (\Exception $e) {
            Log::error('Error in ItineraryDestinationController@store: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing the request.'], 500);
        }
    }


    public function exportToThread($itinerary_id)
    {
        try {
            $user = Auth::user(); // Make sure you're using auth middleware

            // 1. Fetch itinerary with related destinations
            $itinerary = Itinerary::with('destinations')->find($itinerary_id);

            if (!$itinerary) {
                return response()->json(['message' => 'Itinerary not found'], 404);
            }

            // 2. Check if a thread already exists
            $existingThread = Threads::where('itinerary_id', $itinerary_id)->first();
            if ($existingThread) {
                return response()->json(['message' => 'Thread already exists for this itinerary'], 409);
            }

            // 3. Create thread
            $thread = Threads::create([
                'user_id' => $user->user_id,
                'itinerary_id' => $itinerary_id,
                'views' => 0,
                'likes' => 0,
            ]);

            return response()->json([   
                'message' => 'Thread exported successfully',
                'thread_id' => $thread->thread_id,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error exporting to thread: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to export thread'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($itinerary_id)
    {
        $itinerary = Itinerary::with([
            'destinations',
            'days.itineraryDestinations.place', // Eager-load place data
        ])->find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }

        return response()->json([
            'user_id' => $itinerary->user_id,
            'itinerary_id' => $itinerary->itinerary_id,
            'itinerary_name' => $itinerary->itinerary_name,
            'budget' => $itinerary->budget,
            'destination_id' => $itinerary->destinations->pluck('destination_id')->first(),
            'destination_name' => $itinerary->destinations->pluck('destination_name')->first(),
            'start_date' => $itinerary->start_date,
            'end_date' => $itinerary->end_date,
            'itinerary_description' => $itinerary->itinerary_description,
            'places' => collect($itinerary->days)->flatMap(function ($day) {
                return $day->itineraryDestinations->map(function ($dest) use ($day) {
                    return [
                        'day_id' => $day->day_id,
                        'place_id' => $dest->place_id,
                        'place_name' => $dest->place->place_name ?? null,
                        'visit_order' => $dest->visit_order,
                        'place_est_price' => $dest->est_price,
                        'place_rating' => $dest->place->place_rating ?? null,
                        'place_picture' => $dest->place->place_picture ?? null,
                        'place_description' => $dest->place->place_description ?? null,
                    ];
                });
            })->sortBy('visit_order')->values(),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItineraryDestination $itineraryDestination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItineraryDestinationRequest $request, $itinerary_id)
    {
        Log::info('Update method called', $request->all());

        $validated = $request->validated();

        try {
            $itineraryId = $itinerary_id;

            // Tambahkan update budget jika ada di request
            if ($request->has('budget')) {
                $itinerary = Itinerary::findOrFail($itineraryId);
                $itinerary->budget = $request->input('budget');
                $itinerary->save();
            }

            // You can ignore $itinerary_id from param or validate it matches the request
            // Assuming the request does NOT include itinerary_id field, so use param:
            $destinationId = $request->input('destination_id') ?? 
                            Itinerary::findOrFail($itineraryId)->destinations()->first()->destination_id;

            if (!$destinationId) {
                return response()->json(['error' => 'Destination not found for this itinerary.'], 400);
            }

            $dayIds = collect($validated['destinations'])->pluck('day_id')->unique();

            ItineraryDestination::where('itinerary_id', $itineraryId)
                ->where('destination_id', $destinationId)
                ->whereIn('day_id', $dayIds)
                ->delete();

            foreach ($validated['destinations'] as $data) {
                $place = \App\Models\Places::findOrFail($data['place_id']);

                ItineraryDestination::create([
                    'itinerary_id' => $itineraryId,
                    'place_id' => $place->place_id,
                    'day_id' => $data['day_id'],
                    'destination_id' => $destinationId,
                    'place_name' => $place->place_name,
                    'place_rating' => $place->place_rating,
                    'place_image' => $place->place_image,
                    'place_description' => $place->place_description,
                    'visit_order' => $data['visit_order'],
                    'est_price' => $data['est_price'] ?? null,
                ]);
            }

            Log::info('Update completed');
            return response()->json(['message' => 'Itinerary destinations updated successfully.'], 201);
        } catch (\Exception $e) {
            Log::error('Error in ItineraryDestinationController@update: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update destinations.'], 500);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItineraryDestination $itineraryDestination)
    {
        //
    }
}
