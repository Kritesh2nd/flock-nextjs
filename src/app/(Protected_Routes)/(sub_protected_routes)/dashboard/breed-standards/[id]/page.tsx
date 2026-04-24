"use client";
import BreedStandard from "@/components/BreedStandards/BreedStandard";
import { useAuthStore } from "@/store/authstore";
import { useParams } from "next/navigation";

const BreedStandards = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const { id } = useParams();

  const breedIdString = Array.isArray(id) ? id[0] : id;

  return (
    <section>
      {(role === "ADMIN" ||
        role === "MODERATOR" ||
        role === "SUPER_ADMIN" ||
        role === "SUPER_ROLE") && (
        <>
          <BreedStandard breedIdFromPage={breedIdString} />
        </>
      )}
    </section>
  );
};

export default BreedStandards;
