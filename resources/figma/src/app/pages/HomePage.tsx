import { Star, Heart } from "lucide-react";

const categories = [
  { name: "Dresses", icon: "👗", color: "bg-pink-100" },
  { name: "Tops & Blouses", icon: "👚", color: "bg-purple-100" },
  { name: "Bottoms", icon: "👖", color: "bg-blue-100" },
  { name: "Outerwear", icon: "🧥", color: "bg-indigo-100" },
  { name: "Accessories", icon: "👜", color: "bg-rose-100" },
  { name: "Shoes", icon: "👠", color: "bg-fuchsia-100" },
];

const products = [
  {
    id: 1,
    name: "Elegant Floral Maxi Dress",
    price: 89.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Silk Blouse - Ivory",
    price: 65.99,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&h=500&fit=crop",
  },
  {
    id: 3,
    name: "High-Waist Wide Leg Pants",
    price: 79.99,
    rating: 4.7,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=500&fit=crop",
  },
  {
    id: 4,
    name: "Designer Leather Handbag",
    price: 199.99,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
  },
  {
    id: 5,
    name: "Cashmere Cardigan",
    price: 129.99,
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
  },
  {
    id: 6,
    name: "Summer Midi Skirt",
    price: 59.99,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop",
  },
  {
    id: 7,
    name: "Classic White Sneakers",
    price: 95.99,
    rating: 4.7,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
  },
  {
    id: 8,
    name: "Statement Earrings Set",
    price: 39.99,
    rating: 4.4,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              Elevate Your Style
            </h1>
            <p className="text-xl mb-8 text-pink-100">
              Discover the latest trends in women's fashion with exclusive collections
            </p>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`${category.color} rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-medium text-gray-800">{category.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <button className="text-pink-600 font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-pink-600">
                    ${product.price}
                  </span>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
