<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;
use App\Models\Places;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 places (you can adjust the number)
        Places::factory(50)->create()->each(function ($place) {
            // Assign a random destination to each place
            $destination = Destination::inRandomOrder()->first();
            $place->destination_id = $destination->destination_id;
            $place->save();
        });
    }
}
