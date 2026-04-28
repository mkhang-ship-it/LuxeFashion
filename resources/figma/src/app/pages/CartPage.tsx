import { useEffect, useState } from "react";
import { Minus, Plus, X, ShoppingBag, Shield, Truck, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkout,
  getCart,
  getProducts,
  removeCartItem,
  type CartItem,
  updateCartItem,
} from "../services/api";

export function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productImageMap, setProductImageMap] = useState<Record<number, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    Promise.all([getCart(), getProducts()])
      .then(([cart, products]) => {
        setCartItems(cart.items || []);
        const imageMap = products.reduce<Record<number, string>>((acc, p) => {
          if (p.image) acc[p.id] = p.image;
          return acc;
        }, {});
        setProductImageMap(imageMap);
      })
      .catch(() => {
        setCartItems([]);
      });
  }, []);

  const updateQuantity = async (id: number, change: number) => {
    const current = cartItems.find((item) => item.product_id === id);
    if (!current) return;

    try {
      const updatedCart = await updateCartItem(id, Math.max(1, current.qty + change));
      setCartItems(updatedCart.items || []);
    } catch {
      alert("Cannot update quantity right now.");
    }
  };

  const removeItem = async (id: number) => {
    try {
      const updatedCart = await removeCartItem(id);
      setCartItems(updatedCart.items || []);
    } catch {
      alert("Cannot remove this item right now.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax - discount;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE10") {
      const amount = subtotal * 0.1;
      setDiscount(amount);
      alert("Coupon applied: 10% off subtotal.");
      return;
    }

    if (code === "FREESHIP") {
      setDiscount(shipping);
      alert("Coupon applied: free shipping.");
      return;
    }

    setDiscount(0);
    alert("Invalid coupon code.");
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout(discount);
      const refreshed = await getCart();
      setCartItems(refreshed.items || []);
      setDiscount(0);
      setCouponCode("");
      navigate(`/order-success?order_no=${encodeURIComponent(result.order_no)}&total=${encodeURIComponent(result.total)}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed.");
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link
              to="/"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <article key={item.product_id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex gap-4">
                    <img
                      src={productImageMap[item.product_id] || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-pink-600 mb-3">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product_id, -1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 border-x border-gray-300">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product_id, 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Apply Coupon</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-700">
                      <span>Discount</span>
                      <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-pink-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="block text-center text-pink-600 hover:underline mt-4"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Trust Badges</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Free Shipping Over $100</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CreditCard className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>Multiple Payment Options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
