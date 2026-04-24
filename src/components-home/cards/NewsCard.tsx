"use client";
import { NewsCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";

const NewsCard = ({ id, img, title, des }: NewsCardProps) => {
  const router = useRouter();
  const validImg = img && img !== "null" ? img : "/icons/placeholder.png";

  return (
    <div
      className="flex flex-col gap-3 border border-border rounded-xl shadow-sm p-3 justify-around items-start overflow-hidden"
      onClick={() => router.push(`/articles/${id}`)}
    >
      <Image
        src={validImg}
        alt={title || "News Image"}
        width={500}
        height={500}
        className="h-40 w-full object-cover rounded-sm"
        unoptimized
      />

      <h1 className="text-base font-semibold">{title}</h1>
      <p className="text-sm text-[#00000080]">{des}</p>
      <button className="text-[#1B008AB2] hover:underline flex items-center text-xs cursor-pointer gap-1">
        Read Full Details <FaArrowRight />
      </button>
    </div>
  );
};

export default NewsCard;
