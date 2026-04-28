import { FormEvent, useEffect, useMemo, useState } from "react";
import { User, Package, Heart, MapPin, Shield, LogOut } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrders, getProfile, getWishlist, logout, removeFromWishlist, type OrderSummary, type WishlistItem, updateProfile } from "../services/api";

const menuItems = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: Shield },
  { id: "logout", label: "Logout", icon: LogOut },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const splitName = useMemo(() => fullName.trim().split(/\s+/), [fullName]);
  const firstName = splitName[0] || "";
  const lastName = splitName.slice(1).join(" ");

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    const isValidTab = menuItems.some((item) => item.id === requestedTab && item.id !== "logout");
    setActiveTab(isValidTab && requestedTab ? requestedTab : "profile");
  }, [searchParams]);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setFullName(profile.full_name);
        setEmail(profile.email);
        setPhone(profile.phone);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (activeTab !== "orders") return;

    getOrders()
      .then(setOrders)
      .catch(() => {
        setOrders([]);
      });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "wishlist") return;

    getWishlist()
      .then(setWishlistItems)
      .catch(() => {
        setWishlistItems([]);
      });
  }, [activeTab]);

  const handleMenuClick = (id: string) => {
    if (id === "logout") {
      logout().finally(() => {
        alert("Logged out.");
        navigate("/login");
      });
      return;
    }

    setSearchParams({ tab: id });
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ full_name: fullName, phone });
      setFullName(updated.full_name);
      setEmail(updated.email);
      setPhone(updated.phone);
      alert("Profile saved successfully.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Save failed.");
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-pink-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <h2 className="font-semibold text-gray-900">{fullName || "User"}</h2>
              <p className="text-sm text-gray-600">{email || "No email"}</p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-pink-50 text-pink-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-3 bg-white rounded-lg shadow-md p-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === "profile"
                  ? "Personal Information"
                  : menuItems.find((item) => item.id === activeTab)?.label}
              </h2>
              {activeTab === "profile" ? (
                <form
                  className="space-y-4"
                  onSubmit={handleSaveProfile}
                >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        const nextFirst = e.target.value.trim();
                        const nextName = [nextFirst, lastName].filter(Boolean).join(" ");
                        setFullName(nextName);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        const nextLast = e.target.value.trim();
                        const nextName = [firstName, nextLast].filter(Boolean).join(" ");
                        setFullName(nextName);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
                </form>
              ) : activeTab === "orders" ? (
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <article key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{order.order_no}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-pink-100 text-pink-700 px-3 py-1 text-sm font-medium">
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
                          <div>
                            <p className="text-gray-500">Subtotal</p>
                            <p className="font-medium">${order.subtotal.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Shipping</p>
                            <p className="font-medium">${order.shipping.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tax</p>
                            <p className="font-medium">${order.tax.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total</p>
                            <p className="font-semibold text-pink-600">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-gray-600">You do not have any orders yet.</p>
                  )}
                </div>
              ) : activeTab === "wishlist" ? (
                <div className="space-y-4">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                      <article key={item.product_id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-pink-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await removeFromWishlist(item.product_id);
                            setWishlistItems((prev) => prev.filter((wishlistItem) => wishlistItem.product_id !== item.product_id));
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="text-gray-600">Your wishlist is empty.</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  This section is ready. Connect it to backend data when API is available.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
