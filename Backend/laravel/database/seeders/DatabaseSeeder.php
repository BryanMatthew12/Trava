<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Destination;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $names = [
            'DKI Jakarta',
            // 'Serang',
            'Anyer',
            'Banten',
            'Ujung Kulon',
            'Bandung',
            'Bogor & Puncak',
            'Sukabumi',
            'Pangandaran',
            'Garut',
            'Semarang',
            'Solo',
            'Magelang',
            'Karimunjawa',
            'Dieng Plateau',
            'Yogyakarta',
            'Gunung Kidul',
            'Kulon Progo',
            'Surabaya',
            'Malang & Batu',
            'Bromo-Tengger-Semeru',
            'Banyuwangi',
        ];

        foreach ($names as $name) {
        $destination = Destination::create([
            'destination_name' => $name,
        ]);

        // 🌍 Geocode to get lat & lng
        $geoResponse = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $destination->destination_name,
            'key' => env('GOOGLE_MAPS_API_KEY'),
        ]);

        if ($geoResponse->successful() && $geoResponse['status'] === 'OK') {
            $location = $geoResponse['results'][0]['geometry']['location'];
            $destination->latitude = $location['lat'];
            $destination->longitude = $location['lng'];
            $destination->save();
        }
    }


        $this->call([
            UserSeeder::class,
            DestinationSeeder::class,
            DestinationItinerarySeeder::class,
            ItinerarySeeder::class, 
            LocationSeeder::class,
            PlaceSeeder::class,
            CategoryPlaceSeeder::class,
        ]);
    }

    
}
