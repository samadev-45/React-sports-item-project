import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users from db.json
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const filteredUsers = res.data.filter((u) => u.role === "user");
      setUsers(filteredUsers);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  // Toggle block status
  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user.id}`, { isBlock: !user.isBlock });
      toast.success(`${user.name} ${user.isBlock ? "unblocked" : "blocked"}!`);
      fetchUsers(); // updating the state
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6"> Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Blocked</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t text-sm">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 text-center">{user.isBlock ? "Yes" : "No"}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleBlock(user)}
                    className={`px-3 py-1 rounded text-white ${
                      user.isBlock ? "bg-red-600 hover:bg-green-700" : "bg-black hover:bg-red-700"
                    }`}
                  >
                    {user.isBlock ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
