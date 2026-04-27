"use client";
import BreedStandard from "@/components/BreedStandards/BreedStandard";
import { useAuthStore } from "@/store/authstore";

const BreedStandards = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <section>
      {(role === "ADMIN" ||
        role === "MODERATOR" ||
        role === "SUPER_ADMIN" ||
        role === "SUPER_ROLE") && (
        <>
          <BreedStandard breedIdFromPage={null} />
        </>
      )}
    </section>
  );
};

export default BreedStandards;
