import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const axiosPrivate = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Tambahkan token dari localStorage ke setiap request
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// (Opsional) Tangani unauthorized di sini kalau mau redirect otomatis
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — kemungkinan token invalid atau expired");
      // Kamu bisa redirect ke login kalau mau:
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
