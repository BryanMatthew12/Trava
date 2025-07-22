<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Places;
use App\Http\Requests\StorePlacesRequest;
use App\Http\Requests\UpdatePlacesRequest;
use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use App\Services\PlacesService;
use Illuminate\Support\Facades\Validator;

class PlacesController extends Controller
{
    protected $placesService;

    public function __construct(PlacesService $placesService)
    {
        $this->placesService = $placesService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function storePlace(StorePlacesRequest $request)
    {
        $validated = $request->validated();

        // Try to resolve or create the location
        $locationName = $validated['location_name'] ?? null; // Make sure your request includes this
        $locationId = null;

        if ($locationName) {
            // Call Google Geocoding API
            $apiKey = config('services.google.key');
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $locationName,
                'key' => $apiKey,
            ]);
            $data = $response->json();

            if ($data['status'] === 'OK') {
                $geo = $data['results'][0]['geometry']['location'];
                $address = $data['results'][0]['formatted_address'];

                // 2. Save location to DB if not exists
                $location = Location::firstOrCreate(
                    ['location_name' => $locationName],
                    [
                        'latitude' => $geo['lat'],
                        'longitude' => $geo['lng'],
                        'address' => $address,
                    ]
                );
                $locationId = $location->location_id;
            }
        }

        // Create the Place
        $place = Places::create([
            'destination_id'    => $validated['destination_id'],
            'place_name'        => $validated['place_name'],
            'place_description' => $validated['place_description'] ?? null,
            'location_id'       => $locationId,
            'place_rating'      => $validated['place_rating'] ?? null,
            'place_picture'     => $validated['place_picture'] ?? null,
            'place_est_price'   => $validated['place_est_price'] ?? null,
            'operational'       => $validated['operational'] ?? null,
            'views'             => $validated['views'] ?? 0,
        ]);

        if (!$place->exists) {
            Log::error('Place was not saved to the database!');
        }

        Log::info('Place created:', $place->toArray());


        // Handle many-to-many relation (categories)
        if (isset($validated['category_ids'])) {
            $place->categories()->sync($validated['category_ids']);
        }

        return response()->json([
            'message' => 'Place saved successfully',
            'place'   => $place
        ], 201);
    }

    public function storePlacesBulk(Request $request)
    {
        $placesData = $request->input('places');

        if (!is_array($placesData) || empty($placesData)) {
            return response()->json(['error' => 'Invalid places data'], 400);
        }

        $createdPlaces = [];

        foreach ($placesData as $index => $placeData) {
            // Validate each item using StorePlacesRequest rules
            $validator = Validator::make($placeData, (new StorePlacesRequest())->rules());

            if ($validator->fails()) {
                return response()->json([
                    'error' => "Validation failed at index $index",
                    'messages' => $validator->errors(),
                ], 422);
            }

            // Location resolving logic
            $locationName = $placeData['location_name'] ?? null;
            $locationId = null;

            if ($locationName) {
                $apiKey = config('services.google.key');
                $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                    'address' => $locationName,
                    'key' => $apiKey,
                ]);
                $data = $response->json();

                if ($data['status'] === 'OK') {
                    $geo = $data['results'][0]['geometry']['location'];
                    $address = $data['results'][0]['formatted_address'];

                    $location = Location::firstOrCreate(
                        ['location_name' => $locationName],
                        [
                            'latitude' => $geo['lat'],
                            'longitude' => $geo['lng'],
                            'address' => $address,
                        ]
                    );
                    $locationId = $location->location_id;
                }
            }

            $place = Places::create([
                'destination_id'    => $placeData['destination_id'],
                'place_name'        => $placeData['place_name'],
                'place_description' => $placeData['place_description'] ?? null,
                'location_id'       => $locationId,
                'place_rating'      => $placeData['place_rating'] ?? null,
                'place_picture'     => $placeData['place_picture'] ?? null,
                'place_est_price'   => $placeData['place_est_price'] ?? null,
                'operational'       => $placeData['operational'] ?? null,
                'views'             => $placeData['views'] ?? 0,
            ]);

            if (isset($placeData['category_ids'])) {
                $place->categories()->sync($placeData['category_ids']);
            }

            $createdPlaces[] = $place;
        }

        return response()->json([
            'message' => count($createdPlaces) . ' places saved successfully',
            'places'  => $createdPlaces,
        ], 201);
    }


    

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $place = Places::with('categories', 'location')->findOrFail($id);

        $response = $place->toArray();

        $response['location_name'] = $place->location->location_name ?? null;

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
    public function destroy($id)
    {
        $place = Places::find($id);

        if (!$place) {
            return response()->json(['message' => 'Place not found'], 404);
        }

        $place->delete();

        return response()->json(['message' => 'Place deleted successfully']);
    }

    /**
     * Get filtered places.
     */
    public function getFilteredPlaces()
    {
        // Ambil semua tempat
        $places = Places::select('place_id', 'place_name', 'place_description', 'location_id', 'place_picture', 'place_rating', 'views', 'operational')
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

        // Urutkan tempat berdasarkan views (ascending), abis itu (descending)
        $sortedPlaces = $filteredPlaces->sort(function ($a, $b) {
            if ($a->views == $b->views) {
                return $b->place_rating <=> $a->place_rating; // Jika views sama, urutkan berdasarkan rating (descending)
            }
            return $a->views <=> $b->views; // Urutkan berdasarkan views (ascending)
        })->values(); // Reset indeks array

        $finaldata = $sortedPlaces->take(10);

        return response()->json($finaldata);
    }

    public function getAllPlaces()
    {
        // Get query parameters
        $destinationId = request()->query('destination_id');
        $placeId = request()->query('place_id');
        $name = request()->query('name'); // Tambah query param name
        $sortBy = request()->query('sort_by', 'descending'); // Default to descending
        $page = request()->query('page', 1); // Default to page 1 if not provided or empty
        $perPage = 15; // Number of items per page

        $page = is_numeric($page) && $page > 0 ? (int)$page : 1;

        // Determine the sorting direction
        $sortDirection = $sortBy === 'ascending' ? 'asc' : 'desc';

        // Calculate the offset based on the page
        $offset = ($page - 1) * $perPage;

        $query = Places::query();
        if ($name) {
                $query->where('place_name', 'LIKE', '%' . $name . '%');
            } elseif ($placeId) {
                $query->where('place_id', $placeId);
            } elseif ($destinationId) {
                $query->where('destination_id', $destinationId);
            }

        $places = $query->with('location')
                ->orderBy('place_rating', $sortDirection)
                ->skip($offset)
                ->take($perPage)
                ->get();

        $places->transform(function ($place) {
            $placeArray = $place->toArray();
            $placeArray['location_name'] = $place->location->location_name ?? null;
            return $placeArray;
        });

        return response()->json($places);
    }


    public function updatePlace(UpdatePlacesRequest $request, $place_id)
    {
        $place = $this->placesService->updatePlace($request, $place_id);

        if (!$place) {
            return response()->json(['message' => 'Place not found'], 404);
        }

        return response()->json([
            'message' => 'Place updated successfully',
            'place'   => $place
        ]);
    }

    // AAAA
    
    public function incrementViews(Request $request, $id)
    {
        $user = $request->user();
        $place = Places::find($id);

        if (!$place) {
            return response()->json(['message' => 'Place not found!'], 404);
        }

        // Cek apakah user sudah pernah view place ini
        if (!$place->viewsUsers()->where('place_user_views.user_id', $user->user_id)->exists()) {
            $place->viewsUsers()->attach($user->user_id);
            $place->views += 1;
            $place->save();
        }

        return response()->json([
            'message' => 'Place view counted!',
            'data' => $place,
        ]);
    }

    
}