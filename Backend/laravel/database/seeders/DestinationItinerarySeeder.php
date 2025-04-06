<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Itinerary;
use App\Models\Destination;

class DestinationItinerarySeeder extends Seeder
{
    public function run(): void
    {
        $itineraries = Itinerary::all();
        $destinations = Destination::all();

        foreach ($itineraries as $itinerary) {
            // Attach 1 to 3 random destinations per itinerary
            $itinerary->destinations()->attach(
                $destinations->random(rand(1, 3))->pluck('destination_id')->toArray()
            );
        }
    }
}
