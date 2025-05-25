<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $names = [
            'Jakarta Pusat', 
            'Jakarta Selatan',
            'Jakarta Barat',
            'Jakarta Timur',
            'Jakarta Utara',
            'Serang',
            'Anyer',
            'Tanjung Lesung',
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
            Destination::factory()->create([
                'destination_name' => $name,
            ]);
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
