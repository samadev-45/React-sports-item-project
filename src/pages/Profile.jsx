import React, { useContext } from "react";
import { AuthContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">{user.name} Profile</h1>

      <div className="space-y-4 text-lg">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black text-white  hover:bg-red-600 transition"
          style=
          
          {{borderRadius:"20px"}}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
