"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { LuMailOpen } from "react-icons/lu";
import { forgetPassword } from "./action";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      const res = await forgetPassword(formData.email);
      if (res.success) {
        sessionStorage.setItem("otpRequested", "true");
        sessionStorage.setItem("reset-email", formData.email);
        toast.success("Reset code successfully sent.");
        router.push("/forget-password/verify-otp");
      }
    } catch (error) {
      console.error("Unable to get otp:", error);
      toast.error("Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage?.removeItem("otpRequested");
    sessionStorage?.removeItem("reset-email");
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <div className="w-sm border border-border px-4 py-6 rounded-lg space-y-3 bg-white">
          <div className="space-y-1 flex flex-col items-center">
            <LuMailOpen className="bg-[#DCFFE9] text-[#1BAE70] p-2 rounded-full text-5xl" />
            <h1 className="text-center text-2xl font-bold">Forgot Password?</h1>
            <span className="text-sm text-black/40">
              No worries, we’ll send you reset instructions.{" "}
            </span>
          </div>
          <form
            onSubmit={verifyEmail}
            className="flex flex-col gap-3.5 items-center justify-center py-3 px-2"
          >
            <div className="flex flex-col gap-1 w-xs">
              <label
                htmlFor="password"
                className="text-sm flex gap-1.5 items-center"
              >
                <CiMail className="text-[#1BAE70]/50" />
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                className="w-full border border-border rounded-3xl px-5 py-2"
                onChange={handleInputChange}
              />
              {error && <p className="text-red-400 text-xs ml-4">{error}</p>}
            </div>

            <button
              type="submit"
              className="bg-[#1BAE70] w-3xs text-white rounded-3xl py-2 hover:scale-103 transition duration-300 cursor-pointer"
            >
              {isLoading ? "Sending Code...." : "Send Reset Code"}
            </button>
            <Link
              href="/login"
              className="text-xs flex items-center gap-1 text-secondary hover:underline transition duration-100"
            >
              <FaArrowLeft />
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
