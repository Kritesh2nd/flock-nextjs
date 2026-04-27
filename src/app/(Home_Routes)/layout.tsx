import Footer from "@/components-home/common/Footer";
import Header from "@/components-home/common/Header";
import Navbar from "@/components-home/common/Navbar";
import { Noto_Sans_Devanagari, Poppins } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const noto = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${poppins.className} ${noto.className} flex flex-col bg-[#FFF8DC]/50`}
    >
      <Toaster position="top-right" />
      <Header />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
