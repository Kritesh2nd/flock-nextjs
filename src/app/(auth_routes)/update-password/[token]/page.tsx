"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "@/lib/axios.utils";
import { MdOutlineShield } from "react-icons/md";

const PasswordReset = () => {
  const { token } = useParams(); // token from URL
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (!formData.newPassword || formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or expired token");
      return;
    }

    setIsLoading(true);

    try {
      // logging in again to make sure the user is new or not
      const res = await axiosInstance.post(
        `/auth/password-reset/url/${token}`, // backend endpoint
        { newPassword },
      );

      if (res.data.success) {
        toast.success("Password updated successfully!");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-sm border border-border px-4 py-6 rounded-lg space-y-4 bg-white">
        <div className="space-y-2 flex flex-col items-center">
          <MdOutlineShield className="bg-[#DCFFE9] text-[#1BAE70] p-1 rounded-full text-5xl" />
          <h1 className="text-center text-2xl font-bold">
            Update Your Password
          </h1>
          <span className="text-sm text-black/40">
            For security, please set a new password to continue
          </span>
        </div>
        <form
          onSubmit={handlePasswordUpdate}
          className="flex flex-col gap-3.5 items-center justify-center py-3 px-2"
        >
          <div className="flex flex-col gap-1 w-xs">
            <label htmlFor="password" className="text-sm">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                name="newPassword"
                value={formData.newPassword}
                className="w-full border border-border rounded-3xl px-5 py-2"
                onChange={handleInputChange}
              />
              <span
                className="absolute right-2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-xs">
            <label htmlFor="password" className="text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                className="w-full border border-border rounded-3xl px-5 py-2"
                onChange={handleInputChange}
              />
              <span
                className="absolute right-2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1BAE70] w-3xs text-white rounded-3xl py-2 mt-2 hover:scale-103 transition duration-300 cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
