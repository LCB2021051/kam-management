import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Login API
export const login = async ({ username, password }) => {
  if (!username || !password)
    throw new Error("Username and password are required");

  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });

  return response.data;
};

// Logout API
export const logout = async (username) => {
  if (!username) throw new Error("Username is required for logout");
  const response = await axios.post(`${API_BASE_URL}/auth/logout`, {
    username,
  });
  return response.data;
};

// Simulate an order
export const simulateOrder = async (restaurantId, items) => {
  const response = await axios.post(`${API_BASE_URL}/orders/simulate-order`, {
    restaurantId,
    items,
  });
  return response.data;
};

// pending orders
export const getPendingOrders = async (restaurantId) => {
  const response = await axios.get(`${API_BASE_URL}/orders/pending`, {
    params: { restaurantId },
  });
  return response.data;
};

// complete given order
export const completeOrder = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required to complete the order");
  const response = await axios.patch(
    `${API_BASE_URL}/orders/${orderId}/complete`
  );
  return response.data;
};

// Simulate a call
export const simulateCall = async (restaurantId) => {
  const response = await axios.post(`${API_BASE_URL}/simulate-call`, {
    restaurantId,
  });
  return response.data;
};

// Simulate a transaction
export const simulateTransaction = async (restaurantId, amount) => {
  const response = await axios.post(`${API_BASE_URL}/simulate-transaction`, {
    restaurantId,
    amount,
  });
  return response.data;
};
