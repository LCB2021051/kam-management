import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.js";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // Input for restaurant username
  const [password, setPassword] = useState(""); // Input for restaurant password
  const [loginMessage, setLoginMessage] = useState(""); // Feedback message for login status
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      setLoginMessage("Login successful!");
      navigate(`/client/${response.lead.id}`, {
        state: { username: response.lead.username, name: response.lead.name },
      });
    } catch (error) {
      setLoginMessage("Login failed!");
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Restaurant Login
        </h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
        {loginMessage && (
          <p
            className={`mt-4 text-center text-lg font-semibold ${
              loginMessage.includes("failed")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {loginMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
