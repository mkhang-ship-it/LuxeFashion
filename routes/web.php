<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Create admin user (use only once, then delete this route)
Route::get('/admin-setup', function () {
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

    return response()->json([
        'success' => true,
        'message' => 'Admin user created successfully!',
        'admin' => [
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
            'is_admin' => $admin->is_admin,
        ],
        'credentials' => [
            'email' => 'admin@luxefashion.com',
            'password' => 'Admin@123456',
        ],
    ]);
});

