import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  logout,
  simulateCall,
  simulateOrder,
  getPendingOrders,
  completeOrder,
} from "../services/api";

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]); // State to store pending orders
  const { username, name } = location.state || {};

  // Fetch pending orders on component mount
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleLogout = async () => {
    try {
      if (!username) throw new Error("Restaurant username is missing.");
      await logout(username);
      alert("Logout successful!");
      navigate("/");
    } catch (error) {
      alert("Logout failed!");
      console.error("Error during logout:", error.message);
    }
  };

  const handleSimulateOrder = async () => {
    try {
      const res = await simulateOrder(id, [
        { name: "Item 1", quantity: 2, price: 50 },
        { name: "Item 2", quantity: 1, price: 100 },
      ]);
      setMessage("Order simulated successfully!");
      fetchPendingOrders();
    } catch (error) {
      setMessage("Error simulating order.");
      console.error("Error during order simulation:", error.message);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await getPendingOrders(id); // Fetch pending orders from API
      setPendingOrders(response);
    } catch (error) {
      console.error("Error fetching pending orders:", error.message);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const res = await completeOrder(orderId);
      setMessage(`Order ${orderId} marked as complete.`);
      fetchPendingOrders();
    } catch (error) {
      setMessage("Error completing order.");
      console.error("Error during order completion:", error.message);
    }
  };

  const handleSimulateCall = async () => {
    try {
      await simulateCall(id);
      setMessage("Call simulated successfully!");
    } catch (error) {
      setMessage("Error simulating call.");
      console.error("Error during call simulation:", error.message);
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
            onClick={handleSimulateCall}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Simulate Call
          </button>
          <button
            onClick={handleSimulateOrder}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Simulate Get-Order
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-blue-500">
            {message}
          </p>
        )}

        {/* Pending Orders Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Pending Orders</h3>
          {pendingOrders.length > 0 ? (
            <ul>
              {pendingOrders.map((order) => (
                <li
                  key={order._id}
                  className="p-4 border rounded mb-2 bg-gray-100 flex justify-between items-center"
                >
                  <p>
                    <span className="font-bold">Order ID:</span> {order._id}
                  </p>
                  <button
                    onClick={() => handleCompleteOrder(order._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending orders found.</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
