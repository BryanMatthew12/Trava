<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Itinerary;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        User::factory()
            ->count(20)
            ->hasItineraries(10)
            ->create();

        User::factory()
            ->count(10)
            ->hasItineraries(5)
            ->create();

        User::factory()
            ->count(5)
            ->hasItineraries(3)
            ->create();

        User::factory()
            ->count(2)
            ->create();


    }
}
