import axios from "axios";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
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

// Create a new lead
export const createLead = async (data) => {
  try {
    const response = await axiosInstance.post("/leads", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating lead:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to create lead. Please try again."
    );
  }
};

// Update a lead
export const updateLead = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/leads/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error.message);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};

// Get all leads
export const getLeads = async () => {
  const response = await axiosInstance.get("/leads");
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/leads/dashboard");
  return response.data;
};

// Add a contact to a lead
export const addContactToLead = async (leadId, contactData) => {
  try {
    const response = await axiosInstance.post(
      `/leads/${leadId}/contacts`,
      contactData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding contact:", error.message);
    throw error;
  }
};

// Delete a contact from a lead
export const deleteContactFromLead = async (leadId, contactId) => {
  const response = await axiosInstance.delete(
    `/leads/${leadId}/contacts/${contactId}`
  );
  return response.data;
};

// Get lead by ID
export const getLeadById = async (id) => {
  try {
    const response = await axiosInstance.get(`/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead by ID:", error.message);
    throw error;
  }
};

// Simulate a call
export const simulateCall = async (restaurantId, to, from, about) => {
  if (!restaurantId || !to || !from || !about) {
    throw new Error("All fields (restaurantId, to, from, about) are required.");
  }
  const response = await axiosInstance.post("/calls/simulate-call", {
    restaurantId,
    to,
    from,
    about,
  });
  return response.data;
};

// Get lead statistics
export const getLeadStats = async (leadId) => {
  if (!leadId) throw new Error("Lead ID is required");
  const response = await axiosInstance.get(`/leads/${leadId}/stats`);
  return response.data;
};

// Fetch interactions for a specific restaurant
export const getInteractions = async (restaurantId) => {
  try {
    if (!restaurantId) {
      throw new Error("Restaurant ID is required to fetch interactions.");
    }

    const response = await axiosInstance.get(`/interactions/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interactions:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch interactions."
    );
  }
};

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

// Get leads requiring interaction
export const getLeadsForInteraction = async () => {
  const response = await axiosInstance.get("/leads/interaction-due");
  return response.data;
};

// Get next interaction due
export const getNextInteractionDue = async (restaurantId) => {
  const response = await axiosInstance.get(
    `/leads/interaction-due/${restaurantId}`
  );
  return response.data;
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
  const response = await axiosInstance.get("/leads/performance-matrix");
  return response.data;
};
