"use client";

import { useState, useEffect } from "react";
import { addSubscriptionToUser } from "./action"; // API function
import toast from "react-hot-toast";
import Image from "next/image";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentExpiry?: string | null;
  refreshUsers?: () => void;
}

export default function AddSubscriptionModal({
  isOpen,
  onClose,
  userId,
  currentExpiry,
  refreshUsers,
}: AddSubscriptionModalProps) {
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(0);

  // Calculate remaining days from currentExpiry
  const getCurrentDays = () => {
    if (!currentExpiry) return 0;
    const today = new Date();
    const expiryDate = new Date(currentExpiry);
    return Math.max(
      0,
      Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  };

  const [currentDays, setCurrentDays] = useState(getCurrentDays());

  // Reset modal state when opened or closed
  // useEffect(() => {
  //   if (isOpen) {
  //     setDate("");
  //     setDuration(0);
  //     setCurrentDays(getCurrentDays());
  //   }
  // }, [isOpen, currentExpiry]);
  useEffect(() => {
  if (isOpen) {
    const today = new Date();
    const expiry = currentExpiry ? new Date(currentExpiry) : null;

    setCurrentDays(getCurrentDays());

    if (expiry && expiry > today) {
      // Prefill with previous expiry
      const formatted = expiry.toISOString().split("T")[0];
      setDate(formatted);
      setDuration(getCurrentDays());
    } else {
      setDate("");
      setDuration(0);
    }
  }
}, [isOpen, currentExpiry]);

  // Handle date input change
  const handleDateChange = (value: string) => {
    setDate(value);
    const today = new Date();
    const selected = new Date(value);
    const expiry = currentExpiry ? new Date(currentExpiry) : null;
let baseDate = today;
 if (expiry && expiry > today) {
    baseDate = expiry;
  }

    const diff = Math.max(0, Math.ceil((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    setDuration(diff);
  };

  // Handle subscription extension
  const handleExtend = async () => {
    if (!userId) return toast.error("No user selected!");
    if (!date || duration <= 0)
      return toast.error("Please select a valid date!");

    try {
      await addSubscriptionToUser(userId, { expiryDate: date });
      toast.success(`Subscription extended by ${duration} day(s)!`);
      refreshUsers?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to extend subscription",
      );
    }
  };

  if (!isOpen) return null;

  // Calculate extension days for display
  const extensionDays = duration - currentDays;
  const totalDays = currentDays + Math.max(extensionDays, 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-xl w-95 sm:w-96 py-4 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Image
              src="/Subscription/image.png"
              alt="Subscription Image"
              width={25}
              height={25}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              Add Membership
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Subscription info */}
        <div className="mb-5 text-sm text-gray-700">
          <p className="font-medium">
            Membership:{" "}
            <span className="font-medium">
              {extensionDays > 0
                ? `${currentDays} + ${extensionDays} = ${totalDays} days`
                : `${currentDays} days`}
            </span>
          </p>
        </div>

        {/* Date input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Extend membership
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-black/20"
          />

          {/* Info box */}
          {duration > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-3 text-sm flex items-start gap-2">
              <span className="text-blue-600 text-base mt-0.5">ⓘ</span>
              <p className="text-gray-700">
                After extension, there will be a total of{" "}
                <span className="font-medium">{totalDays}</span> days of
                membership remaining
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExtend}
            className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Extend Membership
          </button>
        </div>
      </div>
    </div>
  );
}
