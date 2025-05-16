<?php

namespace Database\Factories;

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
            'itinerary_name' => $this->faker->word(),
            'user_id' => User::inRandomOrder()->first()?->user_id ?? User::factory(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'budget' => $this->faker->randomFloat(10000, 100000, 1000000),
            'itinerary_description' => $this->faker->paragraph(),
        ];
    }
}
