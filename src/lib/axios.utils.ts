import { useAuthStore } from "@/store/authstore";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: any) => {
    console.error(
      toast.error(
        error.response?.data?.message ?? error.message ?? error.cause,
      ),
    );
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
  },
);

export default axiosInstance;
