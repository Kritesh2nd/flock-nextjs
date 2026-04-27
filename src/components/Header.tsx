"use client";
import { useAuthStore } from "@/store/authstore";
import { getArticleImageUrl } from "@/utils/imageHelper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const img = user?.profileUrl;
  const name = `${user?.firstName} ${user?.lastName}`;

  return (
    <header className="flex justify-end items-center h-18 w-full shadow-sm px-6 bg-[#F2F6FC]">
      <div
        className="flex gap-3 justify-end cursor-pointer max-w-80 w-full items-center"
        onClick={() => router.push("/dashboard/my-profile")}
      >
        <Image
          src={img ? getArticleImageUrl(img) : "/icons/profile-picture.png"}
          alt="No Image"
          className="h-8 w-8 rounded-full object-cover border border-border"
          height={200}
          width={200}
          unoptimized
        />
        <span className="text-base font-semibold capitalize">{name}</span>
      </div>
    </header>
  );
};

export default Header;
