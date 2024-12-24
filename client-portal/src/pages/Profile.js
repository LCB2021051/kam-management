import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/api";

const Profile = () => {
  const { id } = useParams(); // Get restaurant ID from URL params
  const location = useLocation(); // Access state passed during navigation
  const navigate = useNavigate(); // Initialize navigate

  const [message, setMessage] = useState(""); // Feedback message for task simulation
  const { name } = location.state || {}; // Extract name from state or fallback

  const handleTask = (task) => {
    setMessage(`Simulated: ${task}`);
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  const handleLogout = async () => {
    try {
      if (!name) throw new Error("Restaurant name is missing.");
      await logout(name); // Pass the restaurant name to the logout API
      alert("Logout successful!");
      navigate("/"); // Redirect to the login page
    } catch (error) {
      alert("Logout failed!");
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Restaurant Profile
        </h2>
        <p className="text-center text-lg mb-4">
          Welcome to your profile,{" "}
          <span className="font-bold">{name || "Guest"}</span>!
        </p>
        <p className="text-center text-lg mb-4">
          Restaurant ID: <span className="font-bold">{id}</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTask("Transaction")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Simulate Transaction
          </button>
          <button
            onClick={() => handleTask("Call")}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Simulate Call
          </button>
          <button
            onClick={() => handleTask("Order Received")}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Simulate Order Received
          </button>
          <button
            onClick={() => handleTask("Order Completed")}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Simulate Order Completed
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-blue-500">
            {message}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
