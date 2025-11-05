import axios from "axios";
import { store } from "../store/store.js"; // Import your Redux store
import { Base_Url } from "component/Base-Url/BaseUrl.jsx";

const axiosInstance = axios.create({
    baseURL: `${Base_Url}`,
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // Use token from localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default axiosInstance;
