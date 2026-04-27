import axiosInstance from "@/lib/axios.utils";
import { LogInProps } from "@/types";

export const loginUser = async (bodyDto: LogInProps) => {
  const response = await axiosInstance.post("/auth/login", bodyDto);
  return response.data;
};
