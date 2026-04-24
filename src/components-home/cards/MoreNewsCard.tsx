"use client";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

const MoreNewsCard = ({ id, img, title, des }: NewsCardProps) => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col gap-2 justify-around border border-border rounded-xl shadow-sm p-3 cursor-pointer w-full h-50 md:h-58 overflow-hidden"
      onClick={() => router.push(`/articles/${id}`)}
    >
      <Image
        src={img}
        alt={img}
        height={500}
        width={500}
        className="h-25 w-full object-cover rounded-sm"
      />
      <h1 className="text-sm font-semibold">{title}</h1>
      <p className="text-xs text-[#00000080]">{des}</p>
      <button className="text-[#1B008AB2] hover:underline flex items-center text-xs cursor-pointer gap-1">
        Read Full Details <FaArrowRight />
      </button>
    </div>
  );
};

export default MoreNewsCard;
