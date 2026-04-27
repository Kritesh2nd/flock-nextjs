"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <header className="flex justify-between items-center w-full globalContainer">
      <div
        onClick={() => router.push("/")}
        className="flex gap-3 items-center p-1 cursor-pointer"
      >
        <Image
          src="/home-icon/hatchery-logo.png"
          className="h-10 w-10 md:h-14 md:w-14"
          height={300}
          width={300}
          alt="Logo"
        />
        <span className="text-[#101010] text-start text-lg font-semibold">
          Nepal Hatchery
          <span className="text-[#8f94a1] ml-1">
            Industries
            <br /> Association
          </span>
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => router.push("/login")}
          className="text-white bg-primary-home rounded-md px-2 py-1 text-base md:text-sm cursor-pointer"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
