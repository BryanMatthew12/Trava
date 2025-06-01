<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Location;
use App\Http\Controllers\Controller;
use App\Services\GooglePlacesService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LocationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'location_name' => 'required|string',
        ]);

        $name = $request->input('location_name');

        Log::info('Location Name: ' . $name);  


        // Call Google Geocoding API
        $apiKey = config('services.google.key');
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $name,
            'key' => $apiKey,
        ]);

        $data = $response->json();

        Log::info('Google API Response: ', $data);

        if ($data['status'] !== 'OK') {
            return response()->json(['error' => 'Lokasi tidak ditemukan'], 404);
        }

        $location = $data['results'][0]['geometry']['location'];

        // Save to database
        $loc = Location::create([
            'location_name' => $name,
            'latitude' => $location['lat'],
            'longitude' => $location['lng'],
        ]);

        return response()->json($loc);
    }

    protected $googlePlacesService;

    public function __construct(GooglePlacesService $googlePlacesService)
    {
        $this->googlePlacesService = $googlePlacesService;
    }
    
    public function fetchPlaceDetails($placeName)
    {
        Log::info("Fetching place: {$placeName}");

        $placeId = $this->googlePlacesService->findPlaceId($placeName);
        if (!$placeId) {
            return response()->json(['error' => 'Place not found'], 404);
        }

        $place = $this->googlePlacesService->getPlaceDetails($placeId);
        if (!$place) {
            return response()->json(['error' => 'No place details found'], 404);
        }

        // Example of your extra logic in controller
        if (isset($place['geometry']['location'])) {
            $lat = $place['geometry']['location']['lat'];
            $lng = $place['geometry']['location']['lng'];
            $areaLevel2 = $this->getAdministrativeAreaLevel2($lat, $lng);
            $place['administrative_area_level_2'] = $areaLevel2;
        }

        return response()->json($place);
    }

    public function searchPlacesFromGoogle(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
            'location' => 'required|string',
        ]);

        $query = $request->input('query');
        $location = $request->input('location');

        // 1. Get basic places list from Text Search API
        $response = Http::get('https://maps.googleapis.com/maps/api/place/textsearch/json', [
            'query' => "$query in $location",
            'key' => env('GOOGLE_MAPS_API_KEY'),
        ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch data from Google Places API'], 500);
        }

        $results = $response->json()['results'];

        $filteredResults = [];

        foreach ($results as $place) {
            $placeDetailsResponse = Http::get('https://maps.googleapis.com/maps/api/place/details/json', [
                'place_id' => $place['place_id'],
                'fields' => 'name,formatted_address,geometry,rating,place_id,opening_hours,price_level',
                'key' => env('GOOGLE_MAPS_API_KEY'),
            ]);

            if ($placeDetailsResponse->successful()) {
                $details = $placeDetailsResponse->json()['result'];

                $filteredResults[] = [
                    'name' => $details['name'],
                    'formatted_address' => $details['formatted_address'],
                    'geometry' => $details['geometry'],
                    'rating' => $details['rating'] ?? null,
                    'place_id' => $details['place_id'],
                    'opening_hours' => $details['opening_hours'] ?? null,
                    'price_level' => $details['price_level'] ?? null,
                ];
            } else {
                // fallback to basic info if details call fails
                $filteredResults[] = [
                    'name' => $place['name'],
                    'formatted_address' => $place['formatted_address'],
                    'geometry' => $place['geometry'],
                    'rating' => $place['rating'] ?? null,
                    'place_id' => $place['place_id'],
                    'opening_hours' => $place['opening_hours'] ?? null,
                    'price_level' => $place['price_level'] ?? null,
                ];
            }
        }

        return response()->json([
            'results' => $filteredResults
        ]);
    }


    private function getAdministrativeAreaLevel2($lat, $lng)
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'latlng' => "$lat,$lng",
            'key' => $apiKey,
        ]);

        if ($response->failed()) {
            Log::error('Failed to reverse geocode');
            return null;
        }

        $data = $response->json();

        if (empty($data['results'][0]['address_components'])) {
            return null;
        }

        foreach ($data['results'][0]['address_components'] as $component) {
            if (in_array('administrative_area_level_2', $component['types'])) {
                $city = $component['long_name'];
            }    
        }
               
        
        $cityClean = preg_replace('/^(Kota|Kabupaten)\s+/i', '', $city);
        $jakartaParts = [
        'Jakarta Pusat',
        'Jakarta Barat',
        'Jakarta Utara',
        'Jakarta Timur',
        'Jakarta Selatan',
        'Kepulauan Seribu'
        ];

        if (in_array($cityClean, $jakartaParts)) {
            $cityClean = 'DKI Jakarta';
        }
        
        return $cityClean;

        return null;
    }


}
