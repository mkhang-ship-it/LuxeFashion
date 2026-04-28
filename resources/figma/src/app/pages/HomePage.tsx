import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart, addToWishlist, getWishlist, getProducts, removeFromWishlist, type Product } from "../services/api";


const featuredProducts: Product[] = [
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(featuredProducts);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const visibleProducts = query
    ? products.filter((product) => product.name.toLowerCase().includes(query))
    : products;

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      alert("Added to cart successfully.");
    } catch {
      alert("Cannot add to cart right now.");
    }
  };

  const handleToggleWishlist = async (productId: number) => {
    if (!localStorage.getItem("auth_token")) {
      navigate("/login");
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch {
      alert("Cannot update wishlist right now.");
    }
  };

  useEffect(() => {
    getProducts()
      .then((apiProducts) => {
        const normalizedProducts = apiProducts.map((product, index) => ({
          ...product,
          image: product.image || featuredProducts[index % featuredProducts.length]?.image,
          rating: product.rating ?? featuredProducts[index % featuredProducts.length]?.rating ?? 4.5,
          reviews: product.reviews ?? featuredProducts[index % featuredProducts.length]?.reviews ?? 0,
        }));

        setProducts(normalizedProducts.length > 0 ? normalizedProducts : featuredProducts);
      })
      .catch(() => {
        // keep showing featuredProducts if API fails
      });
  }, [])

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      setWishlistIds([]);
      return;
    }

    getWishlist()
      .then((items) => setWishlistIds(items.map((item) => item.product_id)))
      .catch(() => setWishlistIds([]));
  }, []);

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {query ? `Search Results for "${searchParams.get("q")}"` : "Featured Products"}
          </h2>
          <button className="text-pink-600 font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {visibleProducts.map((product, index) => (
            <article
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image || featuredProducts[index % featuredProducts.length]?.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = featuredProducts[index % featuredProducts.length]?.image || "";
                  }}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => handleToggleWishlist(product.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                  <Heart className={`w-5 h-5 ${wishlistIds.includes(product.id) ? "fill-pink-600 text-pink-600" : "text-gray-600"}`} />
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
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && (
          <p className="text-gray-600 mt-6">No products found for your keyword.</p>
        )}
      </section>

    </div>
  );
}
