import { useState } from "react";
import { User, Package, Heart, MapPin, Shield, LogOut } from "lucide-react";

const menuItems = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: Shield },
  { id: "logout", label: "Logout", icon: LogOut },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

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
              <h2 className="font-semibold text-gray-900">John Doe</h2>
              <p className="text-sm text-gray-600">john.doe@example.com</p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
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
                      defaultValue="john.doe@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+84 123 456 789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
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
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Order #ORD-2026-{order}0234</p>
                          <p className="text-sm text-gray-600">Placed on April {20 + order}, 2026</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={`https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=80&fit=crop`}
                          alt="Product"
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Elegant Floral Maxi Dress</p>
                          <p className="text-sm text-gray-600">Quantity: 1</p>
                        </div>
                        <p className="font-semibold text-gray-900">$89.99</p>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 border border-indigo-600 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                      <img
                        src={`https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop`}
                        alt="Product"
                        className="w-24 h-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Designer Leather Handbag</h3>
                        <p className="text-lg font-bold text-pink-600 mb-2">$199.99</p>
                        <button className="bg-pink-600 text-white px-4 py-1 rounded text-sm hover:bg-pink-700">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="bg-pink-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                          Default
                        </span>
                        <p className="font-semibold text-gray-900 mt-2">Home</p>
                        <p className="text-gray-600 mt-1">
                          123 Main Street, Apartment 4B<br />
                          District 1, Ho Chi Minh City<br />
                          Vietnam - 70000
                        </p>
                        <p className="text-gray-600 mt-2">Phone: +84 123 456 789</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-pink-600 hover:underline text-sm">Edit</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-pink-600 hover:border-indigo-600 transition-colors">
                    + Add New Address
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
