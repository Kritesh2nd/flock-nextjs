"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/Recovery/Table";

import {
  getDeletedHatcheries,
  recoverHatchery,
  getDeletedFlock,
  recoverFlock,
  getDeleteUser,
  recoverUser,
} from "@/components/Recovery/recover";
import { toast } from "react-hot-toast";

const RecoveryBin = () => {
  const [isSelected, setIsSelected] = useState("Hatchery Details");
  const [hatcheries, setHatcheries] = useState<any[]>([]);
  const [flocks, setflocks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const fetchDeletedHatcheries = async () => {
    try {
      setLoading(true);
      const response = await getDeletedHatcheries();

      setHatcheries(response || []);
    } catch (err) {
      console.error("Error fetching deleted hatcheries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSelected === "Hatchery Details") fetchDeletedHatcheries();
  }, [isSelected]);

  // Recover a single hatchery
  const handleRecover = async (id: string) => {
    try {
      await recoverHatchery(id);
      fetchDeletedHatcheries(); // refresh table
      toast.success("Hatchery recovered successfully!");
    } catch (err) {
      console.error("Error recovering hatchery:", err);
      toast.error("Failed to recover hatchery");
    }
  };

  const fetchDeletedFlock = async () => {
    try {
      setLoading(true);
      const response = await getDeletedFlock();
      setflocks(response || []);
    } catch (err) {
      console.error("Error fetching deleted flocks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSelected.toLowerCase() === "hatchery details")
      fetchDeletedHatcheries();
    else if (isSelected.toLowerCase() === "flocks details") fetchDeletedFlock();
  }, [isSelected]);

  const handleRecoverFlock = async (id: string) => {
    try {
      await recoverFlock(id);
      fetchDeletedFlock(); // refresh table
      toast.success("Flock recovered successfully!");
    } catch (err) {
      console.error("Error recovering flock:", err);
      toast.error("Failed to recover flock");
    }
  };

  const fetchDeletedUsers = async () => {
    try {
      setLoading(true);
      const response = await getDeleteUser();
      setUsers(response || []);
    } catch (err) {
      console.error("Error fetching deleted users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSelected.toLowerCase() === "hatchery details")
      fetchDeletedHatcheries();
    else if (isSelected.toLowerCase() === "flocks details") fetchDeletedFlock();
    else if (isSelected.toLowerCase() === "user details") fetchDeletedUsers();
  }, [isSelected]);

  const handleRecoverUser = async (id: number) => {
    try {
      await recoverUser(id);
      fetchDeletedUsers(); // refresh table
      toast.success("User recovered successfully!");
    } catch (err) {
      console.error("Error recovering user:", err);
      toast.error("Failed to recover user");
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Table columns
  const hatcheryColumns = [
    { key: "hatcheryName", label: "Name" },
    { key: "address", label: "Address" },
    { key: "registrationNumber", label: "Registered Number" },
    { key: "owner", label: "Owner" },
    { key: "contactNumber", label: "Contact" },
    { key: "updatedAt", label: "Deletion Date" },
  ];
  const flockColumns = [
    { key: "maleChickCount", label: "Male Chick Count" },
    { key: "femaleChickCount", label: "Female Chick Count" },
    { key: "productionPurpose", label: "Production Purpose" },
    { key: "dateOfPlacement", label: "Placement Date" },
    { key: "dateOfBirth", label: "Birth Date" },
    { key: "sourceType", label: "Source Type" },
    { key: "sourceAddress", label: "Source Address" },
    { key: "updatedAt", label: "Updated At" },
  ];
  const userColumns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "roles", label: "Roles" },
    { key: "updatedAt", label: "Updated At" },
  ];

  // Helper to render nested objects (like owner)
  const renderCell = (value: any, key?: string) => {
    if (!value) return "-";

    // Handle date formatting for updatedAt
    if (key === "updatedAt") {
      return formatDate(value);
    }

    // Handle owner object
    if (typeof value === "object") {
      if (value?.firstname && value?.lastname) {
        return `${value.firstname} ${value.lastname}`;
      }
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <section className="">
      {/* Tabs */}
      <ul className="flex gap-2 mb-4">
        {["Hatchery Details", "Flocks Details", "User Details"].map(
          (tab, idx) => (
            <div
              key={idx}
              onClick={() => setIsSelected(tab)}
              className={`text-base duration-200 transition-all rounded-lg px-4 py-2 shadow-sm cursor-pointer ${
                isSelected === tab ? "bg-[#D9D9D966]/70" : "bg-white"
              }`}
            >
              {tab}
            </div>
          ),
        )}
      </ul>

      {/* Hatchery Table */}
      {isSelected === "Hatchery Details" && (
        <DataTable
          title="All Hatcheries"
          des="Restore hatcheries information"
          columns={hatcheryColumns}
          data={hatcheries}
          actions={(row) => (
            <button
              onClick={() => handleRecover(row.id)}
              className="text-white bg-green-500 text-[10px] rounded-md p-1 hover:bg-green-600 transition-colors"
            >
              Recover
            </button>
          )}
          renderCell={renderCell}
          loading={loading}
        />
      )}

      {/* Placeholder for other tabs */}
      {isSelected === "Flocks Details" && (
        <DataTable
          title="All flocks"
          des="Restore flocks information"
          columns={flockColumns}
          data={flocks}
          actions={(row) => (
            <button
              onClick={() => handleRecoverFlock(row.id)}
              className="text-white bg-green-500 text-[10px] rounded-md p-1 hover:bg-green-600 transition-colors"
            >
              Recover
            </button>
          )}
          renderCell={renderCell}
          loading={loading}
        />
      )}
      {isSelected === "User Details" && (
        <DataTable
          title="All Users"
          des="Restore users information"
          columns={userColumns}
          data={users}
          actions={(row) => (
            <button
              onClick={() => handleRecoverUser(row.id)}
              className="text-white bg-green-500 text-[10px] rounded-md p-1 hover:bg-green-600 transition-colors"
            >
              Recover
            </button>
          )}
          renderCell={renderCell}
          loading={loading}
        />
      )}
    </section>
  );
};

export default RecoveryBin;
