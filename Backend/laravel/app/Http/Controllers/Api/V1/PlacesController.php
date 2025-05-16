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
        $page = request()->query('page', 1); // Default to page 1 if not provided or empty
        $perPage = 5; // Number of items per page

        // Ensure page is a valid number
        $page = is_numeric($page) && $page > 0 ? (int)$page : 1;

        // Determine the sorting direction
        $sortDirection = $sortBy === 'ascending' ? 'asc' : 'desc';

        // Calculate the offset based on the page
        $offset = ($page - 1) * $perPage;

        if ($placeId) {
            // Filter places by place_id and sort, apply pagination
            $places = Places::where('place_id', $placeId)
                ->orderBy('place_rating', $sortDirection)
                ->skip($offset)
                ->take($perPage)
                ->get();
        } elseif ($destinationId) {
            // Filter places by destination_id and sort, apply pagination
            $places = Places::where('destination_id', $destinationId)
                ->orderBy('place_rating', $sortDirection)
                ->skip($offset)
                ->take($perPage)
                ->get();
        } else {
            // Return all places sorted by rating, apply pagination
            $places = Places::orderBy('place_rating', $sortDirection)
                ->skip($offset)
                ->take($perPage)
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

        $operational = $validated['operational'] ?? null;
        if (is_array($operational)) {
            $operational = json_encode($operational);
        } elseif (is_string($operational)) {
            // Check if it's valid JSON, if not, set to null or wrap as array
            json_decode($operational);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $operational = null; // or handle as needed
            }
        }

        $place = Places::create([
            'destination_id' => $validated['destination_id'],
            'place_name' => $validated['place_name'],
            'place_description' => $validated['place_description'] ?? null,
            'location' => $validated['location_id'] ?? null,
            'place_rating' => $validated['place_rating'] ?? null,
            'place_picture' => $validated['place_picture'] ?? null,
            'place_est_price' => $validated['place_est_price'] ?? null,
            'operational' => $validated['operational'] ?? null,
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

    /**
     * Get filtered places.
     */
    public function getFilteredPlaces()
    {
        // Ambil semua tempat
        $places = Places::select('place_id', 'place_name', 'place_description', 'location_id', 'place_picture', 'place_rating', 'views')
            ->get();

        if ($places->isEmpty()) {
            return response()->json(['message' => 'No places available'], 404);
        }

        // Cari rating tertinggi
        $highestRating = $places->max('place_rating');

        // Filter tempat dengan rating >= (rating tertinggi - 0.3)
        $filteredPlaces = $places->filter(function ($place) use ($highestRating) {
            return $place->place_rating >= ($highestRating - 0.3);
        });

        // Urutkan tempat berdasarkan views (ascending), lalu rating (descending)
        $sortedPlaces = $filteredPlaces->sort(function ($a, $b) {
            if ($a->views == $b->views) {
                return $b->place_rating <=> $a->place_rating; // Jika views sama, urutkan berdasarkan rating (descending)
            }
            return $a->views <=> $b->views; // Urutkan berdasarkan views (ascending)
        })->values(); // Reset indeks array

        // Ambil hanya 5 tempat teratas
        $limitedPlaces = $sortedPlaces->take(5);

        return response()->json($limitedPlaces);

        // return response()->json($limitedPlaces->map(function ($place) {
        //     return [
        //         'place_id' => $place->place_id,
        //         'place_name' => $place->place_name,
        //         'place_description' => $place->place_description,
        //         'location' => $place->location->name ?? null, // assuming your locations table has a 'name' column
        //         'place_picture' => $place->place_picture,
        //         'place_rating' => $place->place_rating,
        //         'views' => $place->views,
        //     ];
        // }));
    }
}
