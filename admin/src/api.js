import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://127.0.0.1:5000/api"
      : "https://ekart-2-gpnz.onrender.com/api"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ekart_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
