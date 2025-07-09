
const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Users Card */}
      <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Users</h2>
        <p className="text-3xl font-bold text-red-600">12</p>
      </div>

      {/* Orders Card */}
      <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Orders</h2>
        <p className="text-3xl font-bold text-red-600">18</p>
      </div>

      {/* Revenue Card */}
      <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-700 mb-2"> Revenue</h2>
        <p className="text-3xl font-bold text-red-600">₹42,000</p>
      </div>
    </div>
  );
};

export default Dashboard;
