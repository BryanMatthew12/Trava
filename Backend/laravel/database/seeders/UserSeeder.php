<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create or retrieve the roles and store them
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create 20 users with random roles
        User::factory()
            ->count(20)
            ->hasItineraries(10)
            ->hasThreads(3)
            ->hasComments(5)
            ->state(function () use ($adminRole, $userRole) {
                return [
                    'role_id' => rand(0, 1) ? $adminRole->role_id : $userRole->role_id,
                ];
            })
            ->create();

        // Create 10 more
        User::factory()
            ->count(10)
            ->hasItineraries(5)
            ->hasThreads(2)
            ->hasComments(3)
            ->state(function () use ($adminRole, $userRole) {
                return [
                    'role_id' => rand(0, 1) ? $adminRole->role_id : $userRole->role_id,
                ];
            })
            ->create();

        // Create 5 more
        User::factory()
            ->count(5)
            ->state(function () use ($adminRole, $userRole) {
                return [
                    'role_id' => rand(0, 1) ? $adminRole->role_id : $userRole->role_id,
                ];
            })
            ->create();
    }
}
