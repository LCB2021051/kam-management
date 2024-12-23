import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

export const login = async (name) => {
  if (!name) throw new Error("Restaurant name is required");
  const response = await axios.post(`${API_BASE_URL}/login`, { name });
  return response.data;
};
