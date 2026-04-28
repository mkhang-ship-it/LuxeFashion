import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { getCart, getWishlist, logout } from "../services/api";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCartCount = () => {
    getCart()
      .then((cart) => setCartCount(cart.total_qty || 0))
      .catch(() => setCartCount(0));
  };

  const refreshWishlistCount = () => {
    if (!localStorage.getItem("auth_token")) {
      setWishlistCount(0);
      return;
    }

    getWishlist()
      .then((items) => setWishlistCount(items.length))
      .catch(() => setWishlistCount(0));
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "";
    setSearchText(query);
    setIsLoggedIn(Boolean(localStorage.getItem("auth_token")));
    refreshCartCount();
    refreshWishlistCount();
  }, [location.search]);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("auth_token")));
    setMobileOpen(false);
    refreshCartCount();
    refreshWishlistCount();
  }, [location.pathname]);

  useEffect(() => {
    const handleCartUpdated = () => refreshCartCount();
    const handleWishlistUpdated = () => refreshWishlistCount();
    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("wishlist-updated", handleWishlistUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Luxe Fashion
          </Link>

          <form className="hidden md:block flex-1 max-w-xl mx-8" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search fashion items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
            <Link to="/profile?tab=wishlist" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 relative">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 relative">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100">
          <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium">Home</Link>
          <Link to="/contact" className="text-gray-700 hover:text-pink-600">Contact</Link>
          <Link to="/cart" className="text-gray-700 hover:text-pink-600">Cart</Link>
          <Link to="/profile?tab=wishlist" className="text-gray-700 hover:text-pink-600">Wishlist</Link>
          {isLoggedIn ? (
            <Link to="/profile" className="text-gray-700 hover:text-pink-600">Profile</Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-pink-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-pink-600">Register</Link>
            </>
          )}
        </nav>

        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search fashion items..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-700 hover:text-pink-600">Home</Link>
              <Link to="/contact" className="text-gray-700 hover:text-pink-600">Contact</Link>
              <Link to="/cart" className="text-gray-700 hover:text-pink-600">Cart</Link>
              <Link to="/profile?tab=wishlist" className="text-gray-700 hover:text-pink-600">Wishlist</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-pink-600">Profile</Link>
                  <button type="button" onClick={handleLogout} className="text-left text-gray-700 hover:text-pink-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-pink-600">Login</Link>
                  <Link to="/register" className="text-gray-700 hover:text-pink-600">Register</Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
