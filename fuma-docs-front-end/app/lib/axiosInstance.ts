import axios from "axios";

// Use import.meta.env for client-side access to env variables
const API_URL = "http://localhost:3010";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
