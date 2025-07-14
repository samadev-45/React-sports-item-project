import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{user.name}'s Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}</p>
      <h3 className="text-lg font-semibold mt-4">Order Details (hardcoded):</h3>
      <ul className="list-disc pl-6">
        <li>Order #123456 - 2 items - Delivered</li>
        <li>Order #789012 - 1 item - Pending</li>
      </ul>
    </div>
  );
};

export default UserDetails;
