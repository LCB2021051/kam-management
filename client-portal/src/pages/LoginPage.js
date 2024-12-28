import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoginMessage("Login successful!");

      navigate(`/client/${data.user.restaurantId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setLoginMessage(`Login failed: ${errorMessage}`);
      console.error("Error during login:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Client Login
        </h2>
        <input
          type="email"
          autoFocus
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          onClick={handleLogin}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {loginMessage && (
          <p
            className={`mt-4 text-center text-lg font-semibold ${
              loginMessage.toLowerCase().includes("failed")
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
