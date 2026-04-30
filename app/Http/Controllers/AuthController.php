<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Registered successfully',
            'data' => [
                'id' => $user['id'],
                'full_name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'is_admin' => (bool) $user['is_admin'],
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $this->bootstrapFirstAdmin($user);

        $token = $user->createToken('webfashion-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'data' => [
                'id' => $user['id'],
                'full_name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'is_admin' => (bool) $user['is_admin'],
            ],
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $this->bootstrapFirstAdmin($user);
        $user->refresh();

        return response()->json([
            'data' => [
                'id' => $user['id'],
                'full_name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'is_admin' => (bool) $user['is_admin'],
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $this->bootstrapFirstAdmin($user);

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        $user->name = $validated['full_name'];
        $user->phone = $validated['phone'];
        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'data' => [
                'id' => $user['id'],
                'full_name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'is_admin' => (bool) $user['is_admin'],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function orders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $orders = \Illuminate\Support\Facades\DB::table('orders')
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_no' => $order->order_no,
                    'subtotal' => (float) $order->subtotal,
                    'shipping' => (float) $order->shipping,
                    'tax' => (float) $order->tax,
                    'discount' => (float) $order->discount,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                ];
            })
            ->values();

        return response()->json([
            'data' => $orders,
        ]);
    }

    private function bootstrapFirstAdmin(User $user): void
    {
        $hasAdmin = DB::table('users')->where('is_admin', true)->exists();
        if (!$hasAdmin && !$user->is_admin) {
            $user->is_admin = true;
            $user->save();
        }
    }
}

