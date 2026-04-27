"use client";

import { useAuthStore } from "@/store/authstore";
import { useBreedStore } from "@/store/breedStandardStore";
import { useCalculationStore } from "@/store/calculationStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

const DashboardDataProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const { fetchBreed } = useBreedStore();
  const { fetchModerators, fetchHatcheryMembers } = useUserStore();
  const { fetchCalculationData } = useCalculationStore();
  const { fetchAverageStats } = useCalculationStore();

  useEffect(() => {
    if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPER_ROLE") {
      fetchModerators();
    }
  }, [role, fetchModerators]);

  useEffect(() => {
    if (
      role === "ADMIN" ||
      role === "SUPER_ADMIN" ||
      role === "MODERATOR" ||
      role === "SUPER_ROLE"
    ) {
      fetchHatcheryMembers();
    }
  }, [role, fetchHatcheryMembers, fetchBreed]);
  // todo: fecth calculation data

  useEffect(() => {
    fetchCalculationData();
    fetchAverageStats();
    fetchBreed();
  }, []);

  return <>{children}</>;
};

export default DashboardDataProvider;
