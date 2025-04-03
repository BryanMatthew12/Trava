<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $user = User::factory()->create();

        return [
            'user_id' => $user->id, // Link admin to user
            'admin_name'=> $this->faker->name(), // You can replace this with a suitable admin name
            'role' => $user->role, // Get the role from the user 
        ];
    }
}
