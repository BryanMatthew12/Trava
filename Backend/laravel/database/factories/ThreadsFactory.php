<?php

namespace Database\Factories;

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
            'thread_title' => $this->faker->sentence(),
            'thread_content' => $this->faker->paragraph(),
            'thread_picture' => $this->faker->imageUrl(),
            'likes' => $this->faker->numberBetween(0, 100),
            'views' => $this->faker->numberBetween(0, 1000),
        ];
    }
}
