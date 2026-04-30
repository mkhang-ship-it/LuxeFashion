import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminDashboard,
  getAdminOrders,
  getProfile,
  getAdminUsers,
  getCurrentUser,
  setAdminRole,
  updateAdminOrderStatus,
  type AdminDashboard,
  type AdminOrder,
  type AdminUser,
} from "../services/api";

const statusOptions = ["placed", "processing", "shipping", "completed", "cancelled"];

export function AdminPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboardData, usersData, ordersData] = await Promise.all([
        getAdminDashboard(),
        getAdminUsers(),
        getAdminOrders(),
      ]);
      setDashboard(dashboardData);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cannot load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const bootstrap = async () => {
      try {
        const cachedUser = getCurrentUser();
        const user = cachedUser ?? (await getProfile());
        if (!user?.is_admin) {
          navigate("/profile");
          return;
        }

        await loadAdminData();
      } catch {
        navigate("/login");
      }
    };

    void bootstrap();
  }, [navigate]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage users and orders in one place.</p>
          </div>
          <button
            type="button"
            onClick={() => void loadAdminData()}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total users" value={dashboard?.users ?? 0} />
          <StatCard label="Admins" value={dashboard?.admins ?? 0} />
          <StatCard label="Total orders" value={dashboard?.orders ?? 0} />
          <StatCard label="Pending orders" value={dashboard?.pending_orders ?? 0} />
          <StatCard label="Revenue" value={`$${(dashboard?.revenue ?? 0).toFixed(2)}`} />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{user.full_name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await setAdminRole(user.id, !user.is_admin);
                            await loadAdminData();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Cannot update role");
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_admin
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "Customer"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{order.order_no}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 text-pink-600 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          try {
                            await updateAdminOrderStatus(order.id, e.target.value);
                            await loadAdminData();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Cannot update order");
                          }
                        }}
                        className="border border-slate-300 rounded-md px-2 py-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!loading && orders.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={5}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard(props: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className="text-sm text-slate-500">{props.label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{props.value}</p>
    </div>
  );
}
