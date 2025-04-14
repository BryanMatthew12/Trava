<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Itinerary;
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
        //
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
