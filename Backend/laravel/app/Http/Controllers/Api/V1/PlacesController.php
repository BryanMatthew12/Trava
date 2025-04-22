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
        // Get query parameters
        $destinationId = request()->query('destination_id');
        $placeId = request()->query('place_id');
        $sortBy = request()->query('sort_by', 'descending'); // Default to descending

        // Determine the sorting direction
        $sortDirection = $sortBy === 'ascending' ? 'asc' : 'desc';

        if ($placeId) {
            // Filter places by place_id and sort, limit to 5
            $places = Places::where('place_id', $placeId)
                ->orderBy('place_rating', $sortDirection)
                ->take(5)
                ->get();
        } elseif ($destinationId) {
            // Filter places by destination_id and sort, limit to 5
            $places = Places::where('destination_id', $destinationId)
                ->orderBy('place_rating', $sortDirection)
                ->take(5)
                ->get();
        } else {
            // Return all places sorted by rating, limit to 5
            $places = Places::orderBy('place_rating', $sortDirection)
                ->take(5)
                ->get();
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
