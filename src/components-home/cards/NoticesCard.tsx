import { NoticeProps } from "@/types";
import React from "react";

const NoticesCard = ({ date, type, title, des }: NoticeProps) => {
  const getMessageType = (color: string) => {
    switch (color) {
      case "Urgent":
        return "bg-[#FDE2E2] text-red-600";
      case "Policy":
        return "bg-[#FFEDC9] text-yellow-700";
      case "Biosecurity":
        return "bg-[#DAFFA6] text-green-700";
      default:
        return "";
    }
  };

  const formatDate = (date: string) => {
    const [day, month] = date.split(" ");
    return { day, month };
  };

  return (
    <div className="flex gap-4 border border-border p-3 rounded-lg">
      <div className="hidden bg-primary-home rounded-lg text-white w-20 h-20 md:flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold">{formatDate(date).day}</span>
        <span className="text-sm font-medium uppercase">
          {formatDate(date).month}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <span className="md:hidden block text-white font-semibold bg-primary-home px-2 py-1 rounded-lg text-base">
            {date}
          </span>
          <span
            className={`${getMessageType(
              type,
            )}  text-xs text-center rounded-3xl font-semibold px-2 py-1`}
          >
            {type}
          </span>
        </div>

        <h1 className="font-semibold text-lg md:text-xl">{title}</h1>

        <p className="text-sm md:text-base text-primary/70">{des}</p>
      </div>
    </div>
  );
};

export default NoticesCard;
