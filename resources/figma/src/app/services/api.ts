export type Product = {
  id: number
  name: string
  price: number
  image?: string | null
  rating?: number
  reviews?: number
}

export type UserProfile = {
  id: string | number
  full_name: string
  email: string
  phone: string
  is_admin?: boolean
}

export type CartItem = {
  product_id: number
  name: string
  price: number
  qty: number
  subtotal: number
}

export type CartData = {
  id: string
  items: CartItem[]
  total_qty: number
  total: number
}

export type CheckoutResult = {
  order_no: string
  status: string
  total: number
}

export type OrderSummary = {
  id: number
  order_no: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: string
  created_at: string
}

export type WishlistItem = {
  product_id: number
  name: string
  price: number
  image: string
}

export type AdminDashboard = {
  users: number
  admins: number
  orders: number
  pending_orders: number
  revenue: number
}

export type AdminUser = {
  id: number
  full_name: string
  email: string
  phone: string
  is_admin: boolean
  created_at: string
}

export type AdminOrder = {
  id: number
  order_no: string
  status: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  created_at: string
  customer_name: string
  customer_email?: string | null
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api"

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`)
  if (!res.ok) throw new Error("Lỗi API")

  const json = await res.json()
  // API from Laravel returns { data: Product[] }
  return Array.isArray(json?.data) ? (json.data as Product[]) : (json as Product[])
}

export async function addToCart(productId: number, qty = 1): Promise<unknown> {
  const cartId = getCartId()
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartId ? { "X-Cart-Id": cartId } : {}),
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      product_id: productId,
      qty,
      cart_id: cartId,
    }),
  })

  if (!res.ok) throw new Error("Add to cart failed")
  const json = await res.json()
  if (json?.cart_id) localStorage.setItem("cart_id", json.cart_id)
  emitCartUpdated()
  return json
}

export async function getCart(): Promise<CartData> {
  const cartId = getCartId()
  if (!cartId) {
    return { id: "", items: [], total_qty: 0, total: 0 }
  }

  const res = await fetch(`${BASE_URL}/cart`, {
    headers: {
      "X-Cart-Id": cartId,
      ...getAuthHeader(),
    },
  })
  if (!res.ok) throw new Error("Get cart failed")

  const json = await res.json()
  return json?.data as CartData
}

export async function updateCartItem(productId: number, qty: number): Promise<CartData> {
  const cartId = getCartId()
  if (!cartId) throw new Error("Cart not initialized")

  const res = await fetch(`${BASE_URL}/cart/item`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Cart-Id": cartId,
      ...getAuthHeader(),
    },
    body: JSON.stringify({ product_id: productId, qty }),
  })

  if (!res.ok) throw new Error("Update cart item failed")
  const json = await res.json()
  emitCartUpdated()
  return json?.data as CartData
}

export async function removeCartItem(productId: number): Promise<CartData> {
  const cartId = getCartId()
  if (!cartId) throw new Error("Cart not initialized")

  const res = await fetch(`${BASE_URL}/cart/item/${productId}`, {
    method: "DELETE",
    headers: {
      "X-Cart-Id": cartId,
      ...getAuthHeader(),
    },
  })

  if (!res.ok) throw new Error("Remove cart item failed")
  const json = await res.json()
  emitCartUpdated()
  return json?.data as CartData
}

export async function register(payload: {
  full_name: string
  email: string
  phone: string
  password: string
}): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Register failed")
  return json?.data as UserProfile
}

export async function login(payload: { email: string; password: string }): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Login failed")
  if (json?.token) localStorage.setItem("auth_token", json.token)
  if (json?.data) setCurrentUser(json.data as UserProfile)
  emitCartUpdated()
  return json?.data as UserProfile
}

export async function getProfile(): Promise<UserProfile> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get profile failed")
  setCurrentUser(json?.data as UserProfile)
  return json?.data as UserProfile
}

export async function updateProfile(payload: {
  full_name: string
  phone: string
}): Promise<UserProfile> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Update profile failed")
  setCurrentUser(json?.data as UserProfile)
  return json?.data as UserProfile
}

export async function logout(): Promise<void> {
  const token = getAuthToken()
  if (!token) return

  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  localStorage.removeItem("auth_token")
  clearCurrentUser()
  emitCartUpdated()
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get admin dashboard failed")
  return json?.data as AdminDashboard
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get users failed")
  return (json?.data || []) as AdminUser[]
}

export async function setAdminRole(userId: number, isAdmin: boolean): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ is_admin: isAdmin }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Update role failed")
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get admin orders failed")
  return (json?.data || []) as AdminOrder[]
}

export async function updateAdminOrderStatus(orderId: number, status: string): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Update order status failed")
}

export async function checkout(discount = 0): Promise<CheckoutResult> {
  const cartId = getCartId()
  if (!cartId) throw new Error("Cart not initialized")

  const res = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Cart-Id": cartId,
      ...getAuthHeader(),
    },
    body: JSON.stringify({ cart_id: cartId, discount }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Checkout failed")
  localStorage.removeItem("cart_id")
  emitCartUpdated()
  return json?.data as CheckoutResult
}

export async function getOrders(): Promise<OrderSummary[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/auth/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get orders failed")
  return (json?.data || []) as OrderSummary[]
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Get wishlist failed")
  return (json?.data || []) as WishlistItem[]
}

export async function addToWishlist(productId: number): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Add to wishlist failed")
  emitWishlistUpdated()
}

export async function removeFromWishlist(productId: number): Promise<void> {
  const token = getAuthToken()
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Remove from wishlist failed")
  emitWishlistUpdated()
}

function getCartId(): string | null {
  return localStorage.getItem("cart_id")
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token")
}

export function getCurrentUser(): UserProfile | null {
  const raw = localStorage.getItem("auth_user")
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function setCurrentUser(user: UserProfile): void {
  localStorage.setItem("auth_user", JSON.stringify(user))
}

function clearCurrentUser(): void {
  localStorage.removeItem("auth_user")
}

function getAuthHeader(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function emitCartUpdated(): void {
  window.dispatchEvent(new Event("cart-updated"))
}

function emitWishlistUpdated(): void {
  window.dispatchEvent(new Event("wishlist-updated"))
}
