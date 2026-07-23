<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo tài khoản admin
        User::firstOrCreate(
            ['email' => 'admin@luxefashion.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@luxefashion.com',
                'password' => Hash::make('Admin@123456'),
                'phone' => '0123456789',
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        echo "✅ Admin account created!\n";
        echo "Email: admin@luxefashion.com\n";
        echo "Password: Admin@123456\n";
    }
}

