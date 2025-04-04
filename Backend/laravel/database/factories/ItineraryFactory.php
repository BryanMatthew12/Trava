<?php

namespace Database\Factories;

use App\Models\Itinerary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Itinerary>
 */
class ItineraryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'itinerary_id' => $this->faker->unique()->randomNumber(5), // Match model primary key
            'user_id' => User::factory(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'days' => $this->faker->numberBetween(1, 30),
            'budget' => $this->faker->randomFloat(2, 10, 10000),
            'description' => $this->faker->paragraph(),
        ];
    }
}
