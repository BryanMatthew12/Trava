<?php    

// app/Services/GooglePlacesService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GooglePlacesService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GOOGLE_MAPS_API_KEY');
    }

    public function findPlaceId(string $placeName): ?string
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', [
            'input' => $placeName,
            'inputtype' => 'textquery',
            'fields' => 'place_id,name,formatted_address',
            'region' => 'id',
            'key' => $this->apiKey,
        ]);

        if ($response->failed()) {
            Log::error('Google FindPlace API failed');
            return null;
        }

        $data = $response->json();

        return $data['candidates'][0]['place_id'] ?? null;
    }

    public function getPlaceDetails(string $placeId): ?array
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/place/details/json', [
            'place_id' => $placeId,
            'fields' => 'place_id,name,formatted_address,geometry,opening_hours,rating,price_level,photos',
            'key' => $this->apiKey,
        ]);

        if ($response->failed()) {
            Log::error('Google Place Details API failed');
            return null;
        }

        $data = $response->json();

        return $data['result'] ?? null;
    }
}
