<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Destination::factory()
            ->count(10) // 10 destinations
            ->hasPlaces(5) // each has 5 places
            ->create();
    }
}