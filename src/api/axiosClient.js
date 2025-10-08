import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Tambah token ke header jika ada
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Tangani error response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    // Jika 401, tapi endpointnya publik → jangan redirect
    if (response && response.status === 401) {
      const publicEndpoints = ["/tables", "/dashboard"];
      const isPublic = publicEndpoints.some((ep) => config.url.includes(ep));

      if (!isPublic) {
        // Hanya redirect kalau bukan endpoint publik
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
