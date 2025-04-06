<?php

namespace Database\Factories;

use App\Models\Threads;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'comment_id' => $this->faker->unique()->randomNumber(5), // Match model primary key
            'user_id' => User::inRandomOrder()->first()?->user_id ?? User::factory(),
            'thread_id' => Threads::factory(), 
            'content' => $this->faker->paragraph(),
        ];
    }
}
