import axios from "axios";

const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL:apiURL,
});

export const login = async (username, password) => {
  const response = await api.post("auth/token/", { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("auth/register/", { username, email, password });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("auth/token/refresh/", { refresh: refreshToken });
  return response.data;
};

export default api;