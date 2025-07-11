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
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    newCustomers: 0,
  });
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, productsRes] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
        ]);

        const users = usersRes.data;
        const products = productsRes.data;

        const userList = users.filter((user) => user.role === "user"); //filter user
        

        let orderCount = 0;
        let revenue = 0;
        const statusMap = { Delivered: 0, Pending: 0, Shipped: 0, Cancelled: 0 };
        const productSales = {};
        const last7Map = {};
        const recentOrdersList = [];

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toISOString().split("T")[0];
          last7Map[key] = {
            date: date.toLocaleDateString("en-US", { weekday: "short" }),
            quantity: 0,
            revenue: 0,
          };
        }

        userList.forEach((user) => {
          const orders = user.orders || [];
          orderCount += orders.length;

          orders.slice(0, 3).forEach((order) => {
            recentOrdersList.push({
              id: order.id,
              customer: user.name,
              amount: order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
              status: order.status,
              date: new Date(order.time).toLocaleDateString(),
            });
          });

          orders.forEach((order) => {
            statusMap[order.status] = (statusMap[order.status] || 0) + 1;
            const dateKey = new Date(order.time).toISOString().split("T")[0];

            order.items.forEach((item) => {
              const orderRevenue = item.price * item.quantity;
              revenue += orderRevenue;
              if (last7Map[dateKey]) {
                last7Map[dateKey].quantity += item.quantity;
                last7Map[dateKey].revenue += orderRevenue;
              }
              productSales[item.name] =
                (productSales[item.name] || 0) + item.quantity;
            });
          });
        });

        const pieData = Object.entries(statusMap)
          .filter(([_, count]) => count > 0)
          .map(([status, count]) => ({
            name: status,
            value: count,
          }));

        const topItems = Object.entries(productSales)
          .map(([name, value]) => ({ name, quantity: value }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setStats({
          users: userList.length,
          products: products.length,
          orders: orderCount,
          revenue,

          
        });
        setLast7DaysData(Object.values(last7Map));
        setOrderStatusData(pieData);
        setTopSellingItems(topItems);
        setRecentOrders(recentOrdersList.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={stats.users}
          icon="👥"
         
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Orders"
          value={stats.orders}
          icon="📦"
          trend="All time"
          color="bg-green-100"
        />
        <DashboardCard
          title="Total Products"
          value={stats.products}
          icon="🏀"
          color="bg-purple-100"
        />
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon="💰"
          trend="All time"
          color="bg-yellow-100"
        />
      </div>

      {/* Weekly Sales Chart and Order Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Weekly Sales Performance
            </h2>
            <span className="text-sm text-gray-500">
              Total:{" "}
              {last7DaysData.reduce((acc, cur) => acc + cur.quantity, 0)} items
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="quantity"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} orders`, "Count"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Selling Products
          </h2>
          <div className="space-y-4">
            {topSellingItems.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    COLORS[idx % COLORS.length]
                  } bg-opacity-20`}
                >
                  <span className="text-lg">🏆</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.quantity} sold</p>
                </div>
                <div className="text-red-500 font-medium">
                  {Math.round(
                    (item.quantity / topSellingItems[0].quantity) * 100
                  )}
                  %
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {recentOrders.map((order, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.customer} • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹{order.amount.toLocaleString()}
                  </p>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, trend, color }) => (
  <div
    className={`${color} p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
    {trend && (
      <p className="text-xs mt-2 font-medium text-gray-500">{trend}</p>
    )}
  </div>
);

export default Dashboard;
