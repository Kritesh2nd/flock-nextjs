"use client";
import axiosInstance from "@/lib/axios.utils";
import { LogInProps } from "@/types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const LogIn = () => {
  const [formData, setFormData] = useState<LogInProps>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LogInProps>>({});
  // const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const validationErrors: Partial<LogInProps> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", formData);

      if (res.data.newUser && res.data.redirectUrl) {
        //extraction token from the redirectUrl for new Users
        const token = res.data.redirectUrl.split("/").pop(); // last segment is the token
        router.replace(`/update-password/${token}`);
        return;
      }

      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res.data.user.role === "ARTICLE_MANAGER") {
        router.replace("/dashboard/articles");
      } else {
        router.replace("/dashboard/overview");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center px-5 py-8 md:w-sm rounded-xl shadow-md bg-white gap-4">
        <div className="space-y-1 flex flex-col items-center">
          <h1 className="text-2xl font-medium">Welcome Back</h1>
          <h1 className="text-[#333333]/40 text-xs">
            Sign in to access your hatchery dashboard
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center py-4"
        >
          <div className="flex flex-col w-xs gap-2">
            <div className="flex gap-2 text-sm items-center">
              <CiMail className="text-[#1BAE70]" />
              <label htmlFor="email">Email</label>
            </div>
            <input
              type="email"
              name="email"
              className="border border-border rounded-3xl px-5 py-2 text-base"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px]">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-xs">
            <div className="flex gap-2 text-sm items-center">
              <FaLock className="text-[#1BAE70]/30" />
              <label htmlFor="password">Password</label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                className="w-full border border-border rounded-3xl px-5 py-2 text-base"
                onChange={handleInputChange}
              />
              <span
                className="absolute right-2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-400 duration-300 transition cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <div
              className={`${
                errors.password ? "justify-between" : "justify-end"
              } flex w-full`}
            >
              {errors.password && (
                <p className="text-red-500 text-[10px]">{errors.password}</p>
              )}
              <span
                onClick={() => router.push("/forget-password")}
                className="text-blue-500 text-[10px] text-end hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="text-center bg-[#1BAE70] rounded-3xl w-2xs py-2 text-white hover:scale-103 transition duration-300 cursor-pointer mt-2"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          <span className="text-[12px] text-black/40">
            Contact an administrator to create an account
          </span>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
