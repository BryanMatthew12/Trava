<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Destination>
 */
class DestinationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'destination_id' => $this->faker->unique()->randomNumber(5), 
            'destination_name' => $this->faker->city(),
            'description' => $this->faker->paragraph(),
            'destination_picture' => $this->faker->imageUrl(),
        ];
    }
}
