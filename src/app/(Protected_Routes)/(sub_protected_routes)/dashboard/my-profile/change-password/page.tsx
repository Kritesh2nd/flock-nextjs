"use client";
import InputCard from "@/components/common/InputField";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { updatePassword } from "../action";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,15}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      toast.error(
        "Password must include a letter, number, and special character",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
      router.push("/dashboard/my-profile");
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <FaArrowLeft
        className="mb-5 cursor-pointer"
        onClick={() => router.push("/dashboard/my-profile")}
      />

      <section className="flex border border-border rounded-md px-4 py-3 gap-8">
        <div className="flex flex-col gap-4 w-[30%]">
          <div>
            <h1 className="text-lg font-semibold text-primary">
              Password Reset
            </h1>
            <span className="text-secondary text-base">
              Change your account password
            </span>
          </div>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-2">
            <InputCard
              title="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />

            <InputCard
              title="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />

            <InputCard
              title="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-base px-3 py-1 rounded-lg text-white"
              >
                {isChangingPassword ? "Proceeding" : "Proceed"}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="border border-border px-3 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#ECBBB457] px-6 py-3 rounded-xl w-[50%]">
          <span className="text-2xl text-[#BE0000]">
            Choose a strong password:
          </span>
          <ul className="list-disc text-[#BE0000] text-base mt-2">
            <li>8–15 characters</li>
            <li>At least 1 letter</li>
            <li>At least 1 number</li>
            <li>At least 1 special character</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
