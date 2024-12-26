import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getLeads = async () => {
  const response = await axios.get(`${API_URL}/leads`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await axios.post(`${API_URL}/leads`, data);
  return response.data;
};

export const updateLead = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/leads/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error.message);
    throw error;
  }
};

export const deleteLead = async (id) => {
  const response = await axios.delete(`${API_URL}/leads/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/leads/dashboard`);
  return response.data;
};

export const addContactToLead = async (leadId, contactData) => {
  try {
    const response = await axios.post(
      `${API_URL}/leads/${leadId}/contacts`,
      contactData
    );
    return response.data; // Updated lead
  } catch (err) {
    console.error("Error from API:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteContactFromLead = async (leadId, contactId) => {
  const response = await axios.delete(
    `${API_URL}/leads/${leadId}/contacts/${contactId}`
  );
  return response.data; // Return the updated lead
};

export const getLeadById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/leads/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead by ID:", error.message);
    throw error;
  }
};

export const simulateCall = async (restaurantId, to, from, about) => {
  if (!restaurantId || !to || !from || !about) {
    throw new Error("All fields (restaurantId, to, from, about) are required.");
  }

  const response = await axios.post(`${API_URL}/calls/simulate-call`, {
    restaurantId,
    to,
    from,
    about,
  });

  return response.data;
};

export const getLeadStats = async (leadId) => {
  if (!leadId) throw new Error("Lead ID is required");
  const response = await axios.get(`${API_URL}/leads/${leadId}/stats`);
  return response.data;
};

// Fetch interactions for a specific restaurant
export const getInteractions = async (restaurantId) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required to fetch interactions.");
  }

  try {
    const response = await axios.get(`${API_URL}/interactions/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interactions:", error.message);

    const errorMessage =
      error.response?.data?.message || "Failed to fetch interactions.";
    throw new Error(errorMessage);
  }
};

// Add a new interaction for a specific restaurant
export const addInteraction = async (restaurantId, interactionData) => {
  if (!restaurantId || !interactionData) {
    throw new Error("Restaurant ID and interaction data are required.");
  }

  try {
    const response = await axios.post(`${API_URL}/interactions`, {
      restaurantId,
      ...interactionData,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding interaction:", error.message);

    const errorMessage =
      error.response?.data?.message || "Failed to add interaction.";
    throw new Error(errorMessage);
  }
};
