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

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [weeklySales, setWeeklySales] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadDashboardData = async () => {
  //     try {
  //       setLoading(true);
        

  //       // Fetch summary
  //       const summaryRes = await api.get("/admin/orders/summary");
  //       const summary = summaryRes.data.data || {};
  //       setStats({
  //         users: summary.totalUsers || 0,
  //         orders: summary.totalOrders || 0,
  //         products: summary.totalProducts || 0,
  //         revenue: summary.totalRevenue || 0,
  //       });

  //       // Fetch all orders
  //       const ordersRes = await api.get("/admin/orders");
  //       const orders = ordersRes.data.data || [];

  //       const last7Map = {};
  //       const statusMap = {};
  //       const productSales = {};
  //       const recentOrdersList = [];

  //       const today = new Date();
  //       for (let i = 6; i >= 0; i--) {
  //         const date = new Date(today);
  //         date.setDate(today.getDate() - i);
  //         const key = date.toISOString().split("T")[0];
  //         last7Map[key] = { day: date.toLocaleDateString("en-US", { weekday: "short" }), total: 0 };
  //       }

  //       orders.forEach(order => {
  //         const orderDate = new Date(order.time);
  //         const dateKey = orderDate.toISOString().split("T")[0];

  //         // Weekly sales
  //         const totalQty = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  //         if (last7Map[dateKey]) last7Map[dateKey].total += totalQty;

  //         // Order status counts
  //         statusMap[order.status] = (statusMap[order.status] || 0) + 1;

  //         // Top products
  //         order.items.forEach(item => {
  //           if (item.productName) {
  //             productSales[item.productName] = (productSales[item.productName] || 0) + (item.quantity || 0);
  //           }
  //         });

  //         // Recent orders: handle missing price fields
  //         const amount = order.items.reduce((sum, item) => {
  //           const price = item.price ?? item.unitPrice ?? 0;
  //           const qty = item.quantity ?? 0;
  //           return sum + price * qty;
  //         }, 0);

  //         recentOrdersList.push({
  //           id: order.id,
  //           customerName: order.userName,
  //           amount,
  //           status: order.status,
  //           date: order.time,
  //         });
  //       });

  //       // Prepare pie chart data
  //       const pieData = Object.entries(statusMap)
  //         .map(([name, count]) => ({ name, count }))
  //         .filter(e => e.count > 0);

  //       // Top 5 products
  //       const topItems = Object.entries(productSales)
  //         .map(([name, quantity]) => ({ name, quantity }))
  //         .sort((a, b) => b.quantity - a.quantity)
  //         .slice(0, 5);

  //       setWeeklySales(Object.values(last7Map));
  //       setOrderStatus(pieData);
  //       setTopProducts(topItems);
  //       setRecentOrders(recentOrdersList.slice(0, 5));
  //     } catch (err) {
  //       console.error("Error loading dashboard:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadDashboardData();
  // }, []);
  useEffect(() => {
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users, products, and orders in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/Admin/users"),
        api.get("/Products"),
        api.get("/admin/orders"),
      ]);

      const users = usersRes.data.data || [];
      const products = productsRes.data.data || [];
      const orders = ordersRes.data.data || [];

      // Calculate totals
      const totalUsers = users.length;
      const totalProducts = products.length; // total distinct products
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + order.items.reduce((s, item) => s + (item.price ?? item.unitPrice ?? 0) * (item.quantity ?? 0), 0);
      }, 0);

      setStats({
        users: totalUsers,
        orders: totalOrders,
        products: totalProducts,
        revenue: totalRevenue,
      });

      // Continue processing weekly sales, pie chart, top products, recent orders
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

      orders.forEach(order => {
        const orderDate = new Date(order.time);
        const dateKey = orderDate.toISOString().split("T")[0];

        // Weekly sales
        const totalQty = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
        if (last7Map[dateKey]) last7Map[dateKey].total += totalQty;

        // Order status counts
        statusMap[order.status] = (statusMap[order.status] || 0) + 1;

        // Top products
        order.items.forEach(item => {
          if (item.productName) {
            productSales[item.productName] = (productSales[item.productName] || 0) + (item.quantity ?? 0);
          }
        });

        // Recent orders
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

      // Prepare pie chart data
      const pieData = Object.entries(statusMap)
        .map(([name, count]) => ({ name, count }))
        .filter(e => e.count > 0);

      // Top 5 products
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


  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats.users} icon="👥" color="bg-blue-100" />
        <DashboardCard title="Total Orders" value={stats.orders} icon="📦" color="bg-green-100" />
        <DashboardCard title="Total Products" value={stats.products} icon="🏀" color="bg-purple-100" />
        <DashboardCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" color="bg-yellow-100" />
      </div>

      {/* Weekly Sales & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatus}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name }) => name} // only show name
                >
                  {orderStatus.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div>{item.name}</div>
                <div>{item.quantity} sold</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition">
                <div>
                  <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">{order.customerName} • {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                    order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

export default Dashboard;
