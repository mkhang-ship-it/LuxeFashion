<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class ProductController extends Controller
{
    /**
     * Temporary in-code product list to keep API working.
     * Replace with DB (Product model) later.
     */
    private const PRODUCTS = [
        [
            'id' => 1,
            'name' => 'Luxe Dress',
            'price' => 499000,
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
        ],
        [
            'id' => 2,
            'name' => 'Pink Blouse',
            'price' => 259000,
            'image' => 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&h=500&fit=crop',
        ],
        [
            'id' => 3,
            'name' => 'Classic Jeans',
            'price' => 399000,
            'image' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
        ],
    ];

    public function index()
    {
        return response()->json([
            'data' => self::PRODUCTS,
        ]);
    }

    public function show($id)
    {
        $product = collect(self::PRODUCTS)->firstWhere('id', (int) $id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'data' => $product,
        ]);
    }

    public function getWishlist(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $items = Wishlist::where('user_id', $user->id)
            ->orderByDesc('id')
            ->get()
            ->map(function ($wishlist) {
                $product = collect(self::PRODUCTS)->firstWhere('id', (int) $wishlist->product_id);
                if (!$product) {
                    return null;
                }

                return [
                    'product_id' => (int) $wishlist->product_id,
                    'name' => $product['name'],
                    'price' => (float) $product['price'],
                    'image' => $product['image'],
                ];
            })
            ->filter()
            ->values();

        return response()->json(['data' => $items]);
    }

    public function addToWishlist(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'product_id' => ['required', 'integer'],
        ]);

        $product = collect(self::PRODUCTS)->firstWhere('id', (int) $validated['product_id']);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        Wishlist::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => (int) $validated['product_id'],
        ]);

        return response()->json(['message' => 'Added to wishlist']);
    }

    public function removeFromWishlist(Request $request, $productId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Wishlist::where('user_id', $user->id)
            ->where('product_id', (int) $productId)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }

    /**
     * Minimal cart implementation without DB:
     * - client sends (optional) cart_id (header X-Cart-Id or body cart_id)
     * - we store cart in Cache by cart_id
     */
    public function addToCart(Request $request)
    {
        $user = $this->resolveAuthenticatedUser($request);
        $validated = $request->validate([
            'product_id' => ['required', 'integer'],
            'qty' => ['nullable', 'integer', 'min:1'],
            'cart_id' => ['nullable', 'string'],
        ]);

        $cartId = (string) ($request->header('X-Cart-Id')
            ?? ($validated['cart_id'] ?? null)
            ?? Str::uuid());

        $qty = (int) ($validated['qty'] ?? 1);
        $productId = (int) $validated['product_id'];

        $product = collect(self::PRODUCTS)->firstWhere('id', $productId);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        $cart = $this->getOrCreateCart($cartId, $user);
        $item = $cart->items()->where('product_id', $productId)->first();

        if (!$item) {
            $cart->items()->create([
                'product_id' => $productId,
                'name' => $product['name'],
                'price' => $product['price'],
                'qty' => $qty,
                'subtotal' => $product['price'] * $qty,
            ]);
        } else {
            $newQty = $item->qty + $qty;
            $item->update([
                'name' => $product['name'],
                'price' => $product['price'],
                'qty' => $newQty,
                'subtotal' => $product['price'] * $newQty,
            ]);
        }

        $cartData = $this->serializeCart($cart->fresh('items'));

        return response()->json([
            'cart_id' => $cartId,
            'data' => $cartData,
        ]);
    }

    public function getCart(Request $request)
    {
        $user = $this->resolveAuthenticatedUser($request);
        $cartId = $request->header('X-Cart-Id');
        if (!$cartId) {
            return response()->json([
                'message' => 'Cart ID is required',
            ], 422);
        }

        $cart = $this->getOrCreateCart($cartId, $user)->load('items');
        return response()->json([
            'cart_id' => $cartId,
            'data' => $this->serializeCart($cart),
        ]);
    }

    public function updateCartItem(Request $request)
    {
        $user = $this->resolveAuthenticatedUser($request);
        $validated = $request->validate([
            'product_id' => ['required', 'integer'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $cartId = $request->header('X-Cart-Id');
        if (!$cartId) {
            return response()->json([
                'message' => 'Cart ID is required',
            ], 422);
        }

        $cart = $this->getOrCreateCart($cartId, $user);
        $item = $cart->items()->where('product_id', (int) $validated['product_id'])->first();
        if ($item) {
            $item->update([
                'qty' => (int) $validated['qty'],
                'subtotal' => $item->price * (int) $validated['qty'],
            ]);
        }

        $updatedCart = $this->serializeCart($cart->fresh('items'));
        return response()->json([
            'cart_id' => $cartId,
            'data' => $updatedCart,
        ]);
    }

    public function removeCartItem(Request $request, $productId)
    {
        $user = $this->resolveAuthenticatedUser($request);
        $cartId = $request->header('X-Cart-Id');
        if (!$cartId) {
            return response()->json([
                'message' => 'Cart ID is required',
            ], 422);
        }

        $cart = $this->getOrCreateCart($cartId, $user);
        $cart->items()->where('product_id', (int) $productId)->delete();
        $updatedCart = $this->serializeCart($cart->fresh('items'));
        return response()->json([
            'cart_id' => $cartId,
            'data' => $updatedCart,
        ]);
    }

    public function checkout(Request $request)
    {
        $user = $this->resolveAuthenticatedUser($request);
        $validated = $request->validate([
            'cart_id' => ['nullable', 'string'],
            'discount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $cartId = (string) ($request->header('X-Cart-Id')
            ?? ($validated['cart_id'] ?? ''));

        if (!$cartId) {
            return response()->json(['message' => 'Cart ID is required'], 422);
        }

        $cart = Cart::where('public_id', $cartId)->with('items')->first();
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $subtotal = (float) $cart->items->sum('subtotal');
        $shipping = $subtotal > 100 ? 0 : 10;
        $tax = $subtotal * 0.1;
        $discount = (float) ($validated['discount'] ?? 0);
        $total = max(0, $subtotal + $shipping + $tax - $discount);

        $orderNo = 'ORD-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(4));

        if ($user && !$cart->user_id) {
            $cart->user_id = $user->id;
            $cart->save();
        }

        $order = DB::transaction(function () use ($user, $cart, $orderNo, $subtotal, $shipping, $tax, $discount, $total) {
            $orderId = DB::table('orders')->insertGetId([
                'order_no' => $orderNo,
                'user_id' => $user?->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'status' => 'placed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $orderItems = $cart->items->map(function ($item) use ($orderId) {
                return [
                    'order_id' => $orderId,
                    'product_id' => $item->product_id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'qty' => $item->qty,
                    'subtotal' => $item->subtotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->all();

            DB::table('order_items')->insert($orderItems);
            $cart->items()->delete();

            return DB::table('orders')->where('id', $orderId)->first();
        });

        return response()->json([
            'message' => 'Checkout successful',
            'data' => [
                'order_no' => $order->order_no,
                'status' => $order->status,
                'total' => (float) $order->total,
            ],
        ]);
    }

    private function getOrCreateCart(string $cartId, ?User $user): Cart
    {
        $cart = Cart::firstOrCreate(
            ['public_id' => $cartId],
            ['user_id' => $user?->id]
        );

        if ($user && !$cart->user_id) {
            $cart->user_id = $user->id;
            $cart->save();
        }

        return $cart;
    }

    private function resolveAuthenticatedUser(Request $request): ?User
    {
        if ($request->user()) {
            return $request->user();
        }

        $bearerToken = $request->bearerToken();
        if (!$bearerToken) {
            return null;
        }

        $accessToken = PersonalAccessToken::findToken($bearerToken);
        return $accessToken?->tokenable instanceof User ? $accessToken->tokenable : null;
    }

    private function serializeCart(Cart $cart): array
    {
        $items = $cart->items->map(function ($item) {
            return [
                'product_id' => (int) $item->product_id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'qty' => (int) $item->qty,
                'subtotal' => (float) $item->subtotal,
            ];
        })->values();

        return [
            'id' => $cart->public_id,
            'items' => $items,
            'total_qty' => $items->sum('qty'),
            'total' => $items->sum('subtotal'),
        ];
    }
}

