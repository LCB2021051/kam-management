import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login API
export const login = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post("/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error(
      error.response?.data?.message || "Unable to login. Please try again."
    );
  }
};

// Logout API
export const logout = async (userId) => {
  if (!userId) throw new Error("Username is required for logout");
  const response = await axios.post(`${API_BASE_URL}/users/logout`, {
    userId,
  });
  return response.data;
};

// Simulate an order
export const simulateOrder = async (restaurantId, items) => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/orders/simulate-order`,
    {
      restaurantId,
      items,
    }
  );
  return response.data;
};

// pending orders
export const getPendingOrders = async (restaurantId) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/orders/pending`, {
    params: { restaurantId },
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
};

// addInteractions by Client
export const addInteraction = async (interactionData) => {
  const { restaurantId, type, from, to, about } = interactionData;

  if (!restaurantId || !type || !from || !to || !about) {
    throw new Error(
      "All fields (restaurantId, type, from, to, about) are required."
    );
  }

  try {
    const response = await axiosInstance.post("/interactions", interactionData);
    return response.data;
  } catch (error) {
    console.error("Error adding interaction:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to add interaction."
    );
  }
};

// get Admin UserId
export const getAdminUserId = async () => {
  try {
    const response = await axiosInstance.get("/users/admin-id");
    return response.data.adminUserId;
  } catch (error) {
    console.error("Error fetching admin user ID:", error.message);
    throw new Error("Failed to fetch admin user ID");
  }
};
