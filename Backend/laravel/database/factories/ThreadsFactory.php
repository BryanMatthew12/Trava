<?php

namespace Database\Factories;

use App\Models\Itinerary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Threads>
 */
class ThreadsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'thread_id' => $this->faker->unique()->randomNumber(5), 
            'user_id' => User::inRandomOrder()->first()?->user_id ?? User::factory(),
            'itinerary_id' => Itinerary::inRandomOrder()->first()?->itinerary_id ?? Itinerary::factory(),
            'thread_picture' => $this->faker->imageUrl(),
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 100),
        ];
    }
}
