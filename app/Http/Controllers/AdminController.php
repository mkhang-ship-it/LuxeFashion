<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $users = User::count();
        $admins = User::where('is_admin', true)->count();
        $orders = DB::table('orders')->count();
        $revenue = (float) DB::table('orders')->sum('total');
        $pendingOrders = DB::table('orders')->where('status', 'placed')->count();

        return response()->json([
            'data' => [
                'users' => $users,
                'admins' => $admins,
                'orders' => $orders,
                'pending_orders' => $pendingOrders,
                'revenue' => $revenue,
            ],
        ]);
    }

    public function users()
    {
        $users = User::query()
            ->orderByDesc('id')
            ->get(['id', 'name', 'email', 'phone', 'is_admin', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'is_admin' => (bool) $user->is_admin,
                    'created_at' => $user->created_at,
                ];
            })
            ->values();

        return response()->json(['data' => $users]);
    }

    public function setAdminRole(Request $request, int $userId)
    {
        $validated = $request->validate([
            'is_admin' => ['required', 'boolean'],
        ]);

        $targetUser = User::findOrFail($userId);
        $currentUser = $request->user();
        if ($currentUser && $currentUser->id === $targetUser->id && !$validated['is_admin']) {
            return response()->json([
                'message' => 'You cannot remove your own admin role',
            ], 422);
        }

        $targetUser->is_admin = (bool) $validated['is_admin'];
        $targetUser->save();

        return response()->json([
            'message' => 'User role updated',
            'data' => [
                'id' => $targetUser->id,
                'is_admin' => (bool) $targetUser->is_admin,
            ],
        ]);
    }

    public function orders()
    {
        $orders = DB::table('orders')
            ->leftJoin('users', 'users.id', '=', 'orders.user_id')
            ->select(
                'orders.id',
                'orders.order_no',
                'orders.status',
                'orders.subtotal',
                'orders.shipping',
                'orders.tax',
                'orders.discount',
                'orders.total',
                'orders.created_at',
                'users.name as customer_name',
                'users.email as customer_email'
            )
            ->orderByDesc('orders.id')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_no' => $order->order_no,
                    'status' => $order->status,
                    'subtotal' => (float) $order->subtotal,
                    'shipping' => (float) $order->shipping,
                    'tax' => (float) $order->tax,
                    'discount' => (float) $order->discount,
                    'total' => (float) $order->total,
                    'created_at' => $order->created_at,
                    'customer_name' => $order->customer_name ?: 'Guest',
                    'customer_email' => $order->customer_email ?: null,
                ];
            })
            ->values();

        return response()->json(['data' => $orders]);
    }

    public function updateOrderStatus(Request $request, int $orderId)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:placed,processing,shipping,completed,cancelled'],
        ]);

        $affected = DB::table('orders')
            ->where('id', $orderId)
            ->update([
                'status' => $validated['status'],
                'updated_at' => now(),
            ]);

        if (!$affected) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'message' => 'Order status updated',
            'data' => [
                'id' => $orderId,
                'status' => $validated['status'],
            ],
        ]);
    }
}
