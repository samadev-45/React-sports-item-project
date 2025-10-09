import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import { AiOutlineReload } from "react-icons/ai";

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

/* -------------------------------------------------------------------------- */
/* Helper components (must be declared before Dashboard since they're used there) */
/* -------------------------------------------------------------------------- */

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center space-x-2">
    <span
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    ></span>
    <div className="text-sm text-gray-700">
      <div className="font-medium">{label}</div>
      {typeof value !== "undefined" && (
        <div className="text-xs text-gray-500">{value}</div>
      )}
    </div>
  </div>
);

const DashboardCard = ({ title, value, icon, color }) => (
  <div
    className={`${color} p-5 rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all flex justify-between items-center`}
  >
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
    </div>
    <div className="text-gray-800">{icon}</div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Main Dashboard                                                              */
/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [weeklySales, setWeeklySales] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/Admin/users"),
          api.get("/Products"),
          api.get("/admin/orders"),
        ]);

        const users = usersRes.data.data || [];
        const products = productsRes.data.data || [];
        const orders = ordersRes.data.data || [];

        const totalUsers = users.length;
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum, order) =>
            sum +
            order.items.reduce((s, item) => s + (item.price ?? item.unitPrice ?? 0) * (item.quantity ?? 0), 0),
          0
        );

        setStats({ users: totalUsers, orders: totalOrders, products: totalProducts, revenue: totalRevenue });

        const last7Map = {};
        const statusMap = {};
        const productSales = {};
        const recentOrdersList = [];

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toISOString().split("T")[0];
          last7Map[key] = { day: date.toLocaleDateString("en-US", { weekday: "short" }), total: 0 };
        }

        orders.forEach((order) => {
          const orderDate = new Date(order.time);
          const dateKey = orderDate.toISOString().split("T")[0];

          const totalQty = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
          if (last7Map[dateKey]) last7Map[dateKey].total += totalQty;

          statusMap[order.status] = (statusMap[order.status] || 0) + 1;

          order.items.forEach((item) => {
            if (item.productName) {
              productSales[item.productName] = (productSales[item.productName] || 0) + (item.quantity ?? 0);
            }
          });

          const amount = order.items.reduce((sum, item) => {
            const price = item.price ?? item.unitPrice ?? 0;
            const qty = item.quantity ?? 0;
            return sum + price * qty;
          }, 0);

          recentOrdersList.push({
            id: order.id,
            customerName: order.userName,
            amount,
            status: order.status,
            date: order.time,
          });
        });

        const pieData = Object.entries(statusMap)
          .map(([name, count]) => ({ name, count }))
          .filter((e) => e.count > 0);

        const topItems = Object.entries(productSales)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setWeeklySales(Object.values(last7Map));
        setOrderStatus(pieData);
        setTopProducts(topItems);
        setRecentOrders(recentOrdersList.slice(0, 5));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );

  // extract counts for legend values (safe defaults)
  const pendingCount = orderStatus.find((s) => s.name === "Pending")?.count ?? 0;
  const shippedCount = orderStatus.find((s) => s.name === "Shipped")?.count ?? 0;
  const deliveredCount = orderStatus.find((s) => s.name === "Delivered")?.count ?? 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats.users} icon={<FiUsers size={28} />} color="bg-blue-100" />
        <DashboardCard title="Total Orders" value={stats.orders} icon={<FiShoppingCart size={28} />} color="bg-green-100" />
        <DashboardCard title="Total Products" value={stats.products} icon={<FiBox size={28} />} color="bg-purple-100" />
        <DashboardCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<FiDollarSign size={28} />} color="bg-yellow-100" />
      </div>

      {/* Weekly Sales & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Sales</h2>
            <button
              className="text-gray-500 hover:text-gray-700 transition"
              onClick={() => window.location.reload()}
              title="Refresh"
            >
              <AiOutlineReload size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontWeight: 500 }} />
                <YAxis tick={{ fill: "#6b7280", fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  formatter={(value) => [`${value} items`, "Sales"]}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {weeklySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                  ))}
                </Bar>
                <defs>
                  {weeklySales.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
          <div className="flex flex-col items-center">
            <div className="h-64 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus.filter(
                      (s) =>
                        s.name === "Pending" ||
                        s.name === "Shipped" ||
                        s.name === "Delivered"
                    )}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {orderStatus
                      .filter(
                        (s) =>
                          s.name === "Pending" ||
                          s.name === "Shipped" ||
                          s.name === "Delivered"
                      )
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Delivered"
                              ? "#10b981" // green
                              : entry.name === "Shipped"
                              ? "#3b82f6" // blue
                              : "#f59e0b" // yellow for Pending
                          }
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} orders`, name]}
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      borderRadius: 8,
                      border: "none",
                      color: "#374151",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend below the chart */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
              <LegendItem color="#f59e0b" label="Pending" value={`${pendingCount} orders`} />
              <LegendItem color="#3b82f6" label="Shipped" value={`${shippedCount} orders`} />
              <LegendItem color="#10b981" label="Delivered" value={`${deliveredCount} orders`} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <ul className="divide-y divide-gray-200">
            {topProducts.map((item, idx) => (
              <li key={idx} className="flex justify-between py-2">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600">{item.quantity} sold</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <ul className="divide-y divide-gray-200">
            {recentOrders.map((order, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition"
              >
                <div>
                  <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {order.customerName} • {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
