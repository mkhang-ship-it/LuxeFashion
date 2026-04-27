import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Luxe Fashion
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fashion items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
            <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </button>
            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 relative">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
          </nav>
        </div>

        <nav className="flex items-center gap-8 py-3 border-t border-gray-100">
          <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium">
            Home
          </Link>
          <a href="#new-arrivals" className="text-gray-700 hover:text-pink-600">
            New Arrivals
          </a>
          <a href="#dresses" className="text-gray-700 hover:text-pink-600">
            Dresses
          </a>
          <a href="#tops" className="text-gray-700 hover:text-pink-600">
            Tops & Blouses
          </a>
          <a href="#bottoms" className="text-gray-700 hover:text-pink-600">
            Bottoms
          </a>
          <a href="#accessories" className="text-gray-700 hover:text-pink-600">
            Accessories
          </a>
          <a href="#sale" className="text-red-600 hover:text-red-700 font-medium">
            Sale
          </a>
          <Link to="/contact" className="text-gray-700 hover:text-pink-600">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
