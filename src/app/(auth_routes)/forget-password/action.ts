import axiosInstance from "@/lib/axios.utils";

export const forgetPassword = async (email: string) => {
  const res = await axiosInstance.patch("/auth/forget-password-get-otp", {
    email,
  });
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await axiosInstance.patch("/auth/verify-opt", { email, otp });
  return res.data;
};
