"use client";
import HatcheryMember from "@/components/UserManagement/HatcheryMember";
import Moderator from "@/components/UserManagement/Moderator";
import { useAuthStore } from "@/store/authstore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserManagement = () => {
  const user = useAuthStore((s) => s.user);
  const [selectedUser, setSelectedUser] = useState<
    "Moderator" | "Hatchery Member"
  >("Moderator");

  const role = user?.role;
  const searchParams = useSearchParams();
  const editUserId = searchParams.get("editUser");

  useEffect(() => {
    if (editUserId) {
      setSelectedUser("Hatchery Member");
    }
  }, [editUserId]);

  return (
    <section>
      {(role === "ADMIN" || role == "SUPER_ADMIN" || role === "SUPER_ROLE") && (
        <>
          <div className="flex gap-2 pb-4">
            {["Moderator", "Hatchery Member"].map((user) => (
              <button
                key={user}
                className={`text-base 2xl:text-lg duration-200 transition-all rounded-lg px-4 py-2 shadow-sm cursor-pointer ${
                  selectedUser === user ? "bg-[#D9D9D966]/85" : "bg-white"
                }`}
                onClick={() => setSelectedUser(user as any)}
              >
                {user}
              </button>
            ))}
          </div>
          {selectedUser === "Moderator" && <Moderator />}

          {selectedUser === "Hatchery Member" && (
            <HatcheryMember editUserId={editUserId} />
          )}
        </>
      )}
      {role === "MODERATOR" && (
        <>
          <button className="bg-[#D9D9D966]/70 shadow-sm rounded-lg px-4 py-2 text-base mb-4">
            Hatchery Member
          </button>
          <HatcheryMember editUserId={editUserId} />
        </>
      )}
    </section>
  );
};

export default UserManagement;
