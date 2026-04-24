"use client";
import axiosInstance from "@/lib/axios.utils";
import { useAuthStore } from "@/store/authstore";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const HeaderPopup = () => {
  const [closeNotice, setCloseNotice] = useState(false);
  const [status, setStatus] = useState<any>([]);
  const [amount, setAmount] = useState<any>([]);
  const [error, setError] = useState("");
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const getStatus = async () => {
    const res = await axiosInstance.get("/user/my-subscription-status");
    return res.data;
  };

  const getRemainingAmount = async () => {
    const res = await axiosInstance.get("/price-config/calculate/user/me");
    return res.data;
  };
  const fetchStatus = async () => {
    const data = await getStatus();
    setStatus(data);
  };
  const fetchAmount = async () => {
    try {
      const data = await getRemainingAmount();
      setAmount(data);
      if (data.statusCode == 404) {
        setError("You are not linked to a hatchery");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const remainingDays = status?.remainingDays;
  const remainingDues = amount?.financialSummary?.remainingDues;

  useEffect(() => {
    if (role === "HATCHERY_MEMBER") {
      fetchStatus();
      fetchAmount();
      setCloseNotice(true);
    }
  }, [role]);

  return (
    <>
      {closeNotice && (remainingDays <= 10 || remainingDues > 0) && (
        <div className="bg-red-200 px-4 py-3 flex items-center">
          {error && (
            <div className="w-full text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* BOTH */}
          {remainingDays <= 10 && remainingDues > 0 && (
            <span className="w-full text-center text-red-500 text-sm">
              Your membership expires in {remainingDays} days and have a due of
              Rs. {remainingDues}.
            </span>
          )}

          {/* ONLY DAYS */}
          {remainingDays <= 10 && remainingDues === 0 && (
            <span className="w-full text-center text-red-500 text-sm">
              Your membership is about to expire. Remaining days:{" "}
              {remainingDays}
            </span>
          )}

          {/* ONLY DUES */}
          {remainingDues > 0 && remainingDays > 10 && (
            <span className="w-full text-center text-red-500 text-sm">
              Your remaining amount to be paid is Rs. {remainingDues}
            </span>
          )}

          <MdClose
            className="text-secondary cursor-pointer"
            onClick={() => setCloseNotice(false)}
          />
        </div>
      )}
    </>
  );
};

export default HeaderPopup;
