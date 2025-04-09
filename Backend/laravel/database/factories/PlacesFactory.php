<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Places>
 */
class PlacesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'place_id' => $this->faker->unique()->randomNumber(5), 
            'destination_id' => Destination::inRandomOrder()->first()?->destination_id ?? Destination::factory(),
            'category_id' => Category::inRandomOrder()->first()->category_id ?? 1,
            'place_name' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->address(),
            'place_rating' => $this->faker->randomFloat(1, 2, 3, 4, 5),
            'place_picture' => $this->faker->imageUrl(),
            'place_est_price' => $this->faker->randomFloat(20000, 50000, 100000),
        ];
    }
}
