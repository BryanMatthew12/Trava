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
            'destination_name' => $this->faker->randomElement(['Bali', 'Tokyo', 'Paris', 'New York', 'Sydney']),
            'description' => $this->faker->paragraph(),
            'destination_picture' => $this->faker->imageUrl(),
            'destination_location' => $this->faker->address(),
            'operational' => $this->faker->time(),
        ];
    }
}
