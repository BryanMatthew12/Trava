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
        //
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
        $validated = $request->validated();

        $place = Places::create([
            'destination_id' => $validated['destination_id'],
            'place_name' => $validated['place_name'],
            'place_description' => $validated['place_description'] ?? null,
            'location' => $validated['location'] ?? null,
            'place_rating' => $validated['place_rating'] ?? null,
            'place_picture' => $validated['place_picture'] ?? null,
            'place_est_price' => $validated['place_est_price'] ?? null,
            'views' => $validated['views'] ?? 0,
        ]);

        $place->categories()->sync($validated['category_ids']);

        return response()->json($place->load('categories'), 201);
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
