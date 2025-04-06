<?php

namespace Database\Seeders;

use App\Models\User;
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
            ->hasThreads(3)
            ->hasComments(5)
            ->create();

        User::factory()
            ->count(10)
            ->hasItineraries(5)
            ->hasThreads(2)
            ->hasComments(3)
            ->create();

        User::factory()
            ->count(5)
            ->hasItineraries(3)
            ->hasThreads(6)
            ->hasComments(2)
            ->create();

        User::factory()
            ->count(2)
            ->create();


    }
}
