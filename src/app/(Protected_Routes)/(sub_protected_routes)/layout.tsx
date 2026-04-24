"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import DashboardDataProvider from "@/components/DashBoardDataProvider";
import { useAuthStore } from "@/store/authstore";
import { useRouter } from "next/navigation";
import HeaderPopup from "@/components/HeaderPopup";

export const roboto = Roboto({
  subsets: ["latin"],
});

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  // todo: console log user
  // console.log(user);
  useEffect(() => {
    if (!isLoading && user) {
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath === "/login") {
        if (user.newUser && user.redirectUrl) {
          router.push(user.redirectUrl);
        } else if (user.role === "ARTICLE_MANAGER") {
          router.push("/dashboard/articles");
        } else if (user.role === "HATCHERY_MEMBER") {
          router.push("/dashboard/overview");
        }
      }
    }
  }, [isLoading, user, router]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
      </div>
    );

  if (!user) return null;

  const role = user.role;

  if (user.newUser && user.redirectUrl) {
    router.push(user.redirectUrl);
  }

  return (
    <div className={`${roboto.className}`}>
      <Toaster position="top-right" />
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          {role === "HATCHERY_MEMBER" && <HeaderPopup />}
          <main className="flex-1 overflow-auto globalContainer1">
            <DashboardDataProvider>{children}</DashboardDataProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
