<?php

namespace Database\Factories;

use App\Models\Itinerary;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Day>
 */
class DayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'day_id' => $this->faker->unique()->randomNumber(5),
            'itinerary_id' => Itinerary::inRandomOrder()->first()?->itinerary_id ?? Itinerary::factory(),
            'day_number' => $this->faker->numberBetween(1, 10),
        ];
    }
}
