import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">LuxeFashion</h3>
            <p className="text-sm mb-4">
              Your ultimate destination for elegant and trendy women's fashion. Discover your style with us.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-pink-400">About Us</a></li>
              <li><a href="#" className="hover:text-pink-400">New Collection</a></li>
              <li><a href="#" className="hover:text-pink-400">Style Guide</a></li>
              <li><a href="#" className="hover:text-pink-400">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-pink-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-pink-400">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-pink-400">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-pink-400">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Commerce Street, District 1, Ho Chi Minh City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@luxefashion.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 LuxeFashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
