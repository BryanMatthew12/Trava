<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Location;
use App\Http\Controllers\Controller;
use GuzzleHttp\Promise\Create;
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

    public function fetchPlaceDetails($placeName)
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        // Log input
        Log::info("Fetching place: {$placeName}");

        // Step 1: Get place_id
        $searchResponse = Http::get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', [
            'input' => $placeName,
            'inputtype' => 'textquery',
            'fields' => 'place_id,name,formatted_address',
            'region' => 'id', // bias to Indonesia
            'key' => $apiKey,
        ]);

        if ($searchResponse->failed()) {
            Log::error('Google FindPlace API failed');
            return response()->json(['error' => 'Failed to contact Google'], 500);
        }

        $search = $searchResponse->json();
        Log::info('FindPlace response: ' . json_encode($search));

        if (empty($search['candidates'][0]['place_id'])) {
            return response()->json(['error' => 'Place not found'], 404);
        }

        $placeId = $search['candidates'][0]['place_id'];

        // Step 2: Fetch detailed info
        $detailsResponse = Http::get('https://maps.googleapis.com/maps/api/place/details/json', [
            'place_id' => $placeId,
            'fields' => 'place_id,name,formatted_address,geometry,opening_hours,rating,price_level,photos',
            'key' => $apiKey,
        ]);

        if ($detailsResponse->failed()) {
            Log::error('Google Place Details API failed');
            return response()->json(['error' => 'Failed to retrieve place details'], 500);
        }

        $details = $detailsResponse->json();

        if (!isset($details['result'])) {
            return response()->json(['error' => 'No place details found'], 404);
        }

        $place = $details['result'];

        if (isset($place['geometry']['location'])) {
            $lat = $place['geometry']['location']['lat'];
            $lng = $place['geometry']['location']['lng'];
            $areaLevel2 = $this->getAdministrativeAreaLevel2($lat, $lng);
            $place['administrative_area_level_2'] = $areaLevel2;
        }

        return response()->json($place);

        // $place = Create::create([
        //     'place_name' => $place['name'],
        //     'place_description' => $place['formatted_address'],
        //     'location' => $place['geometry']['location'],
        //     'place_rating' => $place['rating'] ?? null,
        //     'place_picture' => $place['photos'][0]['photo_reference'] ?? null,
        //     'operational' => json_encode($place['opening_hours'] ?? []),
        //     'views' => 0,
        // ]);
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
