<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Place;
use App\Models\Places;

class CategoryPlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Loop through all the places
        Places::all()->each(function ($place) {
            // Pick 1 to 3 random categories and attach them to the place
            $categoryIds = Category::inRandomOrder()->take(rand(1, 3))->pluck('category_id');
            $place->categories()->attach($categoryIds);
        });
    }
}
