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

export const updateLead = async (id, data) => {
  const response = await axios.put(`${API_URL}/leads/${id}`, data);
  return response.data;
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
