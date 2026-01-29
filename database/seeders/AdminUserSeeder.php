<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUsername = 'admin';
        $adminPassword = 'admin';

        $existingUser = User::where('username', $adminUsername)->first();

        if (!$existingUser) {
            User::create([
                'id' => (string) Str::uuid(),
                'username' => $adminUsername,
                'password' => Hash::make($adminPassword),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->warn('Default credentials: username=admin, password=admin');
            $this->command->warn('Please change the password after first login!');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
