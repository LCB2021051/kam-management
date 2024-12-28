import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  logout,
  simulateOrder,
  getPendingOrders,
  updateOrderStatus,
  addInteraction,
  getAdminUserId,
} from "../services/api";

const Profile = () => {
  const { id } = useParams(); // Restaurant ID
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]); // State to store pending orders
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage

  // Fetch pending orders on component mount
  useEffect(() => {
    if (id) fetchPendingOrders();
  }, [id]);

  const handleLogout = async () => {
    try {
      if (!user.id) throw new Error("User information is missing.");
      await logout(user.id);
      alert("Logout successful!");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
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

  const handleUpdateStatus = async (orderId, status) => {
    try {
      if (!status) {
        alert("Please select a status.");
        return;
      }

      const result = await updateOrderStatus(orderId, status);
      setMessage(result.message);
      fetchPendingOrders();
    } catch (error) {
      setMessage("Failed to update order status.");
      console.error("Error updating order status:", error.message);
    }
  };

  const handleAddInteraction = async () => {
    try {
      const to = await getAdminUserId();
      const from = user.id || "Anonymous"; // Use user name or fallback
      const type = prompt("Enter type of Interaction (e.g., Call, Email):");
      const about = prompt("Enter details about the interaction:");
      await addInteraction({
        restaurantId: user.restaurantId,
        type,
        from,
        to,
        about,
      });
      setMessage("Interaction simulated successfully!");
    } catch (error) {
      setMessage("Error simulating Interaction.");
      console.error("Error during Interaction simulation:", error.message);
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
          <span className="font-bold">{user.name || "Guest"}</span>!
        </p>
        <p className="text-center text-lg mb-4">
          Restaurant ID: <span className="font-bold">{id}</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAddInteraction}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Simulate Interaction
          </button>
          <button
            onClick={handleSimulateOrder}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Simulate Order
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
                  className="p-4 border rounded mb-2 bg-gray-100 flex justify-between items-center gap-3"
                >
                  <p>
                    <span className="font-bold">Order ID:</span> {order._id}
                  </p>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Completed")}
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
