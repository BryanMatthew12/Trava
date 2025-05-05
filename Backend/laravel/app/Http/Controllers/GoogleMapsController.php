<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GoogleMapsController extends Controller
{
    public function geocode(Request $request)
    {
        $locationId = $request->input('location_id');
        $location = Location::find($locationId);

        if (!$location) {
            return response()->json(['error' => 'Location not found in database'], 404);
        }
    
        $locationName = $location->name;

        $apiKey = config('services.google_maps.key');
    
        // Call Google Geocoding API
        $response = Http::get("https://maps.googleapis.com/maps/api/geocode/json", [
            'address' => $locationName,
            'key' => $apiKey,
        ]);
    
        if ($response->successful() && $response['status'] === 'OK') {
            $coordinates = $response['results'][0]['geometry']['location'];
    
            // Return the latitude and longitude in the response
            return response()->json([
                'lat' => $coordinates['lat'],
                'lng' => $coordinates['lng'],
            ]);
        }
    
        return response()->json(['error' => 'Location not found'], 404);
    }
}
