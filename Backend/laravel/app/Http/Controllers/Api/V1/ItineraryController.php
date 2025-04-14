<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Itinerary;
use App\Models\Destination;
use App\Http\Requests\StoreItineraryRequest;
use App\Http\Requests\UpdateItineraryRequest;
use App\Http\Controllers\Controller;

class ItineraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if the 'itinerary_id' query parameter is present
        $itineraryId = request()->query('itinerary_id');
    
        if ($itineraryId) {
            // Filter itineraries by itinerary_id if the parameter is provided
            $itinerary = Itinerary::where('itinerary_id', $itineraryId)->first();
        } else {
            // Return all itineraries if no itinerary_id is provided
            $itinerary = Itinerary::all();
        }
    
        return response()->json($itinerary);
    }

    /**
     * Display the specified resource.
     */
    public function show($itineraries_id)
    {
        $itinerary = Itinerary::find($itineraries_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }

        return response()->json($itinerary, 200);
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
        dd(auth()->user()); // <- check this

        // Validate Request
        $validated = $request->validated();

        // Calculate days using start and end date
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1;

        // Create the itinerary with calulcated days
        $itinerary = Itinerary::create([
            'user_id' => auth()->user()->user_id,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'day_number' => $days,
            'budget' => $validated['budget'],
            'itinerary_description' => $validated['itinerary_description'],
        ]);

        // Attach destinations name to the itinerary
        $destination = Destination::firstOrCreate([
            'destination_name' => $validated['destination_name'],
        ]);

        // Attach to pivot table
        $itinerary->destinations()->attach($destination->destination_id);
        
        
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
    public function update(UpdateItineraryRequest $request, Itinerary $itinerary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Itinerary $itinerary)
    {
        //
    }
}
