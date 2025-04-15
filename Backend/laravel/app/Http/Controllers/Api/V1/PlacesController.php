<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Places;
use App\Http\Requests\StorePlacesRequest;
use App\Http\Requests\UpdatePlacesRequest;
use App\Http\Controllers\Controller;

class PlacesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if the 'destination_id' or 'place_id' query parameter is present
        $destinationId = request()->query('destination_id');
        $placeId = request()->query('place_id');
    
        if ($placeId) {
            // Filter places by place_id if the parameter is provided
            $places = Places::where('place_id', $placeId)->with('category')->get();
        } elseif ($destinationId) {
            // Filter places by destination_id if the parameter is provided
            $places = Places::where('destination_id', $destinationId)->with('category')->get();
        } else {
            // Return all places if no parameters are provided
            $places = Places::with('category')->get();
        }
    
        return response()->json($places);
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
    public function store(StorePlacesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $place = Places::with('category')->findOrFail($id);
        return response()->json($place);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Places $places)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlacesRequest $request, Places $places)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Places $places)
    {
        //
    }
}
