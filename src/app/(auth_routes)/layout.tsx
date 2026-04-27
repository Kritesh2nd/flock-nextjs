import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${poppins.className}`}>
      <div className="relative h-screen w-screen">
        <Image
          src="/bg/bg.png"
          alt="No Bg"
          fill
          priority
          className="object-cover"
        />
      </div>

      <main className="fixed inset-0 h-full w-full z-20">
        <Toaster position="top-right" containerStyle={{ zIndex: 9999 }} />
        <div className="flex flex-col gap-6 items-center justify-center h-full">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/bg/icon.png"
              alt="icon"
              height={200}
              width={200}
              className="h-20 w-20"
            />
            <span className="text-xl md:text-3xl text-[#1BAE70]">
              Hatchery Management System
            </span>
          </div>
          {children}
          <p className="text-[10px] text-black/40">
            © 2026 Hatchery. Empowering poultry excellence.
          </p>
        </div>
      </main>
    </div>
  );
}
