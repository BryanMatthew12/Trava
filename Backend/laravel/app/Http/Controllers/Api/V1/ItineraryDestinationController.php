<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ItineraryDestination;
use App\Http\Requests\StoreItineraryDestinationRequest;
use App\Http\Requests\UpdateItineraryDestinationRequest;
use App\Http\Controllers\Controller;

class ItineraryDestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ItineraryDestination::all();
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ItineraryDestination $itineraryDestination)
    {
        //
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
