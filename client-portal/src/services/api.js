import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

// Login API
export const login = async ({ username, password }) => {
  if (!username || !password)
    throw new Error("Username and password are required");

  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });

  return response.data;
};

// Logout API
export const logout = async (username) => {
  if (!username) throw new Error("Username is required for logout");
  const response = await axios.post(`${API_BASE_URL}/logout`, { username });
  return response.data;
};
