<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Tạo admin user
$admin = User::firstOrCreate(
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

echo "✅ Admin created!\n";
echo "Email: admin@luxefashion.com\n";
echo "Password: Admin@123456\n";
echo "ID: " . $admin->id . "\n";
?>
