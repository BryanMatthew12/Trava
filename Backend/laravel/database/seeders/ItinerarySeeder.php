<?php

namespace Database\Seeders;

use App\Models\Itinerary;
use App\Models\Day;
use App\Models\Places;
use App\Models\ItineraryDestination;
use Illuminate\Database\Seeder;

class ItinerarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing itineraries
        $itineraries = Itinerary::all();

        foreach ($itineraries as $itinerary) {
            // Create day records based on the 'days' column
            for ($i = 1; $i <= $itinerary->days; $i++) {
                $day = Day::create([
                    'itinerary_id' => $itinerary->itinerary_id,
                    'day_number' => $i,
                ]);

                // For each day, add 1–3 places
                $places = Places::inRandomOrder()->take(rand(1, 3))->get();

                foreach ($places as $index => $place) {
                    ItineraryDestination::create([
                        'itinerary_id' => $itinerary->itinerary_id,
                        'day_id' => $day->id,
                        'place_id' => $place->place_id,
                        'destination_id' => $place->destination_id,
                        'destination_name' => $place->destination->destination_name ?? 'Unknown',
                        'visit_order' => $index + 1,
                        'est_price' => $place->place_est_price,
                    ]);
                }
            }
        }
    }
}
