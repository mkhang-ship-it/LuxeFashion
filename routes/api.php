<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/cart', [ProductController::class, 'addToCart']);
Route::get('/cart', [ProductController::class, 'getCart']);
Route::patch('/cart/item', [ProductController::class, 'updateCartItem']);
Route::delete('/cart/item/{productId}', [ProductController::class, 'removeCartItem']);
Route::post('/checkout', [ProductController::class, 'checkout']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/orders', [AuthController::class, 'orders']);
    Route::get('/wishlist', [ProductController::class, 'getWishlist']);
    Route::post('/wishlist', [ProductController::class, 'addToWishlist']);
    Route::delete('/wishlist/{productId}', [ProductController::class, 'removeFromWishlist']);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
