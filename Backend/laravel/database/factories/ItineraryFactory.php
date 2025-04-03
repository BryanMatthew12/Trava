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
            'user_id' => User::factory(),
            'itinerary_date' => $this->faker->date(),
            'itinerary_budget' => $this->faker->randomFloat(2, 10, 10000),
            'days' => $this->faker->numberBetween(1, 30),
            'itinerary_description' => $this->faker->paragraph(),
        ];
    }
}
