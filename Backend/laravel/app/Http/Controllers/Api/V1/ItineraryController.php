<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Itinerary;
use App\Models\Destination;
use App\Http\Requests\StoreItineraryRequest;
use App\Http\Requests\UpdateItineraryRequest;
use App\Http\Controllers\Controller;
use App\Models\Day;
use App\Models\ItineraryDestination;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ItineraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $itineraryId = request()->query('itinerary_id');
        $userId = request()->query('user_id');

        if ($itineraryId) {
            // Filter itineraries by itinerary_id if the parameter is provided
            $itinerary = Itinerary::where('itinerary_id', $itineraryId)->first();
        } elseif ($userId) { 
            // Filter itineraries by user_id if the parameter is provided
            $itinerary = Itinerary::where('user_id', $userId)->get();
        } else {
            // Return all itineraries if no parameters are provided
            $itinerary = Itinerary::all();
        }

        return response()->json($itinerary);
    }

    /**
     * Display the specified resource.
     */
    public function show($itinerary_id)
    {
        $itinerary = Itinerary::with('destinations')->find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }
    
        return response()->json([
            'itinerary_name' => $itinerary->itinerary_name,
            'start_date' => $itinerary->start_date,
            'end_date' => $itinerary->end_date,
            'budget' => $itinerary->budget,
            'itinerary_description' => $itinerary->itinerary_description,
            'destination_name' => $itinerary->destinations->pluck('destination_name')->first(), // assuming 1 destination
        ], 200);
    }

    public function getUserItineraries($userId)
    {
        $itineraries = Itinerary::with('destinations')
            ->where('user_id', $userId)
            ->get();

        $formatted = $itineraries->map(function ($itinerary) {
            return [
                'itinerary_id' => $itinerary->itinerary_id,
                'itinerary_name' => $itinerary->itinerary_name,
                'destination_name' => $itinerary->destinations->pluck('destination_name')->first(), // assuming 1 destination
                'start_date' => $itinerary->start_date,
                'end_date' => $itinerary->end_date,
            ];
        });
    
        return response()->json($formatted, 200);
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
    public function store(StoreItineraryRequest $request)
    {
        // Validate Request
        $validated = $request->validated();

        // Calculate days using start and end date
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        Log::info('Start Date: ' . $startDate);
        Log::info('End Date: ' . $endDate);
        
        $days = $startDate->diffInDays($endDate) + 1;

        Log::info('Days: ' . $days);

        // Create the itinerary (without saving days count in the database)
        $itinerary = Itinerary::create([    
            'user_id' => auth()->user()->user_id,
            'itinerary_name' => $validated['itinerary_name'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'budget' => $validated['budget'],
            'itinerary_description' => $validated['itinerary_description'] ?? null,
        ]);

        // Create Day records associated with this itinerary
        for ($i = 0; $i < $days; $i++) {
            Day::create([
                'itinerary_id' => $itinerary->itinerary_id,
                'day_number' => $i + 1,  // Day numbers start from 1
            ]);
        }

        // Attach destinations id to the itinerary
        $destination = Destination::firstOrCreate([
            'destination_id' => $validated['destination_id'],
        ]);

        // Attach to pivot table
        $itinerary->destinations()->attach($destination->destination_id);

        return response()->json([
            'message' => 'Itinerary created successfully',
            'id' => $itinerary->itinerary_id,
        ], 201);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Itinerary $itinerary)
    {
        //
    }

    /**
     * Update the specified resource in storage.    
     */
    public function update(UpdateItineraryRequest $request, $itinerary_id)
    {
        $validated = $request->validated();

        // Temukan itinerary berdasarkan ID
        $itinerary = Itinerary::findOrFail($itinerary_id);

        // Update description jika ada di request
        if (array_key_exists('itinerary_description', $validated)) {
            $itinerary->itinerary_description = $validated['itinerary_description'];
        }

        // Update budget jika ada di request
        if (array_key_exists('budget', $validated)) {
            $itinerary->budget = $validated['budget'];
        }

        $itinerary->save();

        return response()->json([
            'message' => 'Itinerary updated successfully.',
            'itinerary' => $itinerary,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($itinerary_id)
    {
        try {
            $itinerary = Itinerary::findOrFail($itinerary_id);

            // Delete related itinerary destinations
            ItineraryDestination::where('itinerary_id', $itinerary_id)->delete();

            // Delete related days
            Day::where('itinerary_id', $itinerary_id)->delete();

            // Optionally delete the destination(s) if not shared across itineraries
            // Destination::where('itinerary_id', $itinerary_id)->delete();

            // Finally, delete the itinerary
            $itinerary->delete();

            return response()->json(['message' => 'Itinerary and all related data deleted successfully.'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting itinerary: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete itinerary.'], 500);
        }
    }

    /**
     * Edit the budget of the specified itinerary.
     */
    public function editBudget(Request $request, $itinerary_id)
    {
        // Validate the request
        $validated = $request->validate([
            'budget' => 'required|numeric|min:100000',
        ]);

        // Find itinerary base on itinerary_id
        $itinerary = Itinerary::find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }

        // Update budget
        $itinerary->budget = $validated['budget'];
        $itinerary->save();

        return response()->json([
            'message' => 'Budget updated successfully.',
            'budget' => $itinerary->budget,
        ], 200);
    }
    
    /**
     * Edit the name of the specified itinerary.
     */
    public function editName(Request $request, $itinerary_id)
    {
        // Validasi request
        $validated = $request->validate([
            'itinerary_name' => 'required|string|max:255',
        ]);

        // Temukan itinerary berdasarkan ID
        $itinerary = Itinerary::find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }

        // Update itinerary_name
        $itinerary->itinerary_name = $validated['itinerary_name'];
        $itinerary->save();

        return response()->json([
            'message' => 'Itinerary name updated successfully.',
            'itinerary_name' => $itinerary->itinerary_name,
        ], 200);
    }

    /**
     * Edit the description of the specified itinerary.
     */
    public function patchDesc(Request $request, $itinerary_id)
    {
        $validated = $request->validate([
            'itinerary_description' => 'required|string',
        ]);

        $itinerary = Itinerary::findOrFail($itinerary_id);
        $itinerary->itinerary_description = $validated['itinerary_description'];
        $itinerary->save();

        return response()->json([
            'message' => 'Description updated successfully.',
            'itinerary_description' => $itinerary->itinerary_description,
        ], 200);
    }
}