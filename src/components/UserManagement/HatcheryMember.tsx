"use client";
import { useEffect, useState } from "react";
import Header from "../common/Header";
import UserModal from "./UserModal";
import { UserFormType } from "@/types";
import { HatcheryMemberType } from "@/types"; // import new type
import { MdDeleteOutline } from "react-icons/md";
import { FaBan } from "react-icons/fa";
import NoDataCard from "../common/NoData";
import Pagination from "../common/Pagination";
import { useUserStore } from "@/store/userStore";
import TableSkeleton from "../loader/TableLoader";
import AddSubscriptionModal from "./AddSubscriptionModal";
import Image from "next/image";
import Link from "next/link";
import { findById, searchBar, updateUserBanStatus } from "./action";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { truncateText } from "@/utils/truncateText";

const HatcheryMember = ({ editUserId }: { editUserId?: string | null }) => {
  const {
    hatcheryMembers,
    deleteUser,
    addOrEditUser,
    currentPage,
    totalItems,
    totalPages,
    currentLimit,
    fetchHatcheryMembers,
    isLoading,
  } = useUserStore();

  const [addHatcheryMember, setAddHatcheryMember] = useState(false);
  const [editingHatcheryMember, setEditingHatcheryMember] =
    useState<HatcheryMemberType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const closeForm = () => setAddHatcheryMember(false);

  const handleAddOrEdit = async (data: UserFormType) => {
    await addOrEditUser(data, "HATCHERY_MEMBER");
    toast.success("User updated successfully");
    setAddHatcheryMember(false);
    setEditingHatcheryMember(null);
  };

  const handleDelete = (id: string) => deleteUser(id, "HATCHERY_MEMBER");

  useEffect(() => {
    document.body.style.overflow = addHatcheryMember ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addHatcheryMember]);

  const handleToggleBan = async (id: number, currentStatus: boolean) => {
    try {
      await updateUserBanStatus(id, !currentStatus);
      toast.success(
        `User successfully ${currentStatus === true ? "banned" : "unbanned."}`,
      );
      fetchHatcheryMembers(currentPage, currentLimit);
    } catch (err) {
      console.error("Failed to update ban status:", err);
    }
  };

  const membersToShow = isSearching
    ? searchResults || []
    : hatcheryMembers || [];

  const EMPTY_ROWS_COUNT =
    membersToShow.length < currentLimit
      ? currentLimit - hatcheryMembers.length
      : 0;

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchBar(search.trim());
        const data = res.data;
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!editUserId) return;

      try {
        const userData = await findById(editUserId);
        const user: HatcheryMemberType = {
          ...userData,
          expiryDate: userData.expiryDate ?? null,
          hatcheryName: userData.hatchery?.hatcheryName ?? "Not Linked",
          isActive: userData.isActive ?? true,
        };

        setEditingHatcheryMember(user);
        setAddHatcheryMember(true);
      } catch (err) {
        console.error("Failed to fetch user by ID", err);
      }
    };

    fetchUser();
  }, [editUserId]);

  useEffect(() => {
    if (editingHatcheryMember) {
      router.replace("/dashboard/user-management");
    }
  }, [editingHatcheryMember, router]);

  return (
    <section className="rounded-md bg-white flex flex-col gap-1">
      <div className="flex flex-col gap-4 h-full">
        <Header
          title="Hatchery Member Management"
          des="Create, edit and manage hatchery members"
          button="Add Hatchery Member"
          onClick={() => {
            setAddHatcheryMember(true);
            setEditingHatcheryMember(null);
          }}
          placeholder="Search Hatchery Members..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        {isLoading ? (
          <TableSkeleton rows={7} columns={8} />
        ) : (
          <div className="h-[calc(100vh-320px)] 2xl:h-[calc(100vh-280px) rounded-lg border border-border">
            {membersToShow.length > 0 ? (
              <table className="w-full h-full table-auto">
                <thead>
                  <tr className="table-row">
                    <th className="cell text-center w-16 rounded-l-lg">ID</th>
                    <th className="cell text-left">Full Name</th>
                    <th className="cell text-left max-w-xs">Email</th>
                    <th className="cell text-left">Hatchery</th>
                    <th className="cell text-center w-36">Role</th>
                    <th className="cell text-center w-44">Membership</th>
                    <th className="cell text-center w-28">Status</th>
                    <th className="cell text-center w-40 rounded-r-lg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(membersToShow as HatcheryMemberType[]).map(
                    (hatchery, i) => (
                      <tr
                        key={`hatchery-${hatchery.id}`}
                        className="table-data"
                      >
                        <td className="cell">
                          {(currentPage - 1) * currentLimit + i + 1}
                        </td>
                        {/* Full Name */}
                        <td className="cell text-left truncate">
                          {hatchery.firstName} {hatchery.lastName}
                        </td>

                        {/* Email */}
                        <td className="cell text-left max-w-xs">
                          {truncateText(hatchery.email, 20) || "-"}
                        </td>

                        {/* Hatchery Link */}
                        <td className="cell text-left">
                          {hatchery.hatchery ? (
                            <Link
                              href={`/dashboard/all-hatcheries/${hatchery.hatchery.id}`}
                              className="text-black text-sm 2xl:text-ba border-b-2 cursor-pointer truncate"
                            >
                              {hatchery.hatchery.hatcheryName}
                            </Link>
                          ) : (
                            <span className="text-black text-sm 2xl:text-sm border-b-2 cursor-pointer">
                              Not Link
                            </span>
                          )}
                        </td>

                        {/* Role */}

                        <td className="cell">
                          {hatchery.roles?.includes("HATCHERY_MEMBER") ? (
                            <span className="bg-green-200 rounded-2xl px-2 py-1 text-sm text-[#0F6B30]">
                              Hatchery_Member
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Subscription */}

                        <td className="cell">
                          {hatchery.expiryDate
                            ? (() => {
                                const today = new Date();
                                const expiry = new Date(hatchery.expiryDate);

                                const diffTime =
                                  expiry.getTime() - today.getTime();
                                const diffDays = Math.ceil(
                                  diffTime / (1000 * 60 * 60 * 24),
                                );

                                return diffDays > 0
                                  ? `${diffDays} days remaining`
                                  : "Expired";
                              })()
                            : "0 days remaining"}
                        </td>

                        {/* Status */}
                        <td className="cell">
                          <span
                            className={`px-2 py-1 text-[#0F6B30] text-sm rounded-2xl ${
                              hatchery.isActive
                                ? "bg-[#DBFCE7] text-[#0F6B30] "
                                : "bg-[#F5DFDF] text-[#BE0000]"
                            }`}
                          >
                            {hatchery.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="cell">
                          <div className="flex items-center gap-1.5 text-secondary  px-1 py-1 text-lg 2xl:text-xl">
                            <button
                              onClick={() => {
                                setEditingHatcheryMember(hatchery);
                                setIsModalOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Image
                                src="/Subscription/image.png"
                                alt="Subscription Image"
                                width={16}
                                height={16}
                              />
                            </button>

                            <FiEdit
                              className="text-blue-500 cursor-pointer"
                              onClick={() => {
                                setEditingHatcheryMember(hatchery);
                                setAddHatcheryMember(true);
                              }}
                            />
                            <FaBan
                              className={`cursor-pointer ${hatchery.isBanned ? "text-green-500" : "text-red-500"}`}
                              onClick={() =>
                                handleToggleBan(
                                  Number(hatchery.id),
                                  hatchery.isBanned,
                                )
                              }
                              title={
                                hatchery.isBanned ? "Unban User" : "Ban User"
                              }
                            />

                            <MdDeleteOutline
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDelete(hatchery.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ),
                  )}

                  {/* Empty rows */}
                  {Array.from({ length: EMPTY_ROWS_COUNT }).map((_, index) => (
                    <tr key={`empty-row-${index}`}>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoDataCard message="No Hatchery members data found." />
            )}

            {editingHatcheryMember && (
              <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={editingHatcheryMember.id.toString()}
                currentExpiry={editingHatcheryMember.expiryDate || null}
                refreshUsers={() =>
                  fetchHatcheryMembers(currentPage, currentLimit)
                }
              />
            )}
            {!isSearching && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={currentLimit}
                totalPages={totalPages}
                onPageChange={(page) =>
                  fetchHatcheryMembers(page, currentLimit)
                }
              />
            )}
          </div>
        )}
      </div>

      {addHatcheryMember && (
        <UserModal
          roleToShow="HATCHERY_MEMBER"
          closeForm={closeForm}
          onSubmit={handleAddOrEdit}
          initialData={editingHatcheryMember}
          title={
            editingHatcheryMember
              ? "Edit Hatchery Member"
              : "Create New Hatchery Member"
          }
          des={
            editingHatcheryMember
              ? "Update Hatchery Member Info"
              : "Add a new hatchery member to the system"
          }
          btn1={editingHatcheryMember ? "Save" : "Create"}
        />
      )}
    </section>
  );
};

export default HatcheryMember;
