<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ItineraryDestination;
use App\Http\Requests\StoreItineraryDestinationRequest;
use App\Http\Requests\UpdateItineraryDestinationRequest;
use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\Itinerary;
use App\Models\Places;
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

        $destinationId = $itinerary->destinations()->first()->destination_id ?? null;

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
                'day_id' => $dayId, // Use the correct day_id
                'destination_id' => $destinationId,
                'place_name' => $placeName,
                'visit_order' => $destinationData['visit_order'],
                'est_price' => $destinationData['est_price'] ?? null,
            ]);
            Log::info('Itinerary Destination Created: ', $destinationData);
        }

        return response()->json(['message' => 'Places added to itinerary.'], 201);
    } catch (\Exception $e) {
        Log::error('Error in ItineraryDestinationController@store: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while processing the request.'], 500);
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
    public function update(UpdateItineraryDestinationRequest $request, ItineraryDestination $itineraryDestination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItineraryDestination $itineraryDestination)
    {
        //
    }
}
