<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Location;
use App\Http\Controllers\Controller;
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
}
