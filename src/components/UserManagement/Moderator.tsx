"use client";
import { useEffect, useState } from "react";
import Header from "../common/Header";
import UserModal from "./UserModal";
import { UserFormType, UserPropsType } from "@/types";
import { MdDeleteOutline } from "react-icons/md";
import { FaBan } from "react-icons/fa";
import NoDataCard from "../common/NoData";
import Pagination from "../common/Pagination";
import { useUserStore } from "@/store/userStore";
import TableSkeleton from "../loader/TableLoader";
import { searchModerator, updateUserBanStatus } from "./action";
import { searchBar } from "./action";
import toast from "react-hot-toast";

const Moderator = () => {
  const {
    moderators,
    addOrEditUser,
    deleteUser,
    fetchModerators,
    modCurrentPage,
    modTotalPages,
    modCurrentLimit,
    isLoading,
    modTotalItems,
  } = useUserStore();
  const [addModerator, setAddModerator] = useState(false);
  const [editingModerator, setEditingModerator] =
    useState<UserPropsType | null>(null);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const closeForm = () => {
    setAddModerator(false);
  };

  const handleDelete = (id: string) => deleteUser(id, "MODERATOR");

  const handleAddOrEdit = async (data: UserFormType) => {
    await addOrEditUser(data, "MODERATOR");
    // toast.success("User updated successfully");
    setAddModerator(false);
    setEditingModerator(null);
  };
  const membersToShow = isSearching ? searchResults || [] : moderators || [];

  const EMPTY_ROWS_COUNT =
    moderators.length < modCurrentLimit
      ? modCurrentLimit - moderators.length
      : 0;

  useEffect(() => {
    if (addModerator) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addModerator]);
  const handleToggleBan = async (id: number, currentStatus: boolean) => {
    try {
      await updateUserBanStatus(id, !currentStatus);
      toast.success(
        `User successfully ${currentStatus !== true ? "banned" : "unbanned."}`,
      );
      fetchModerators(modCurrentPage, modCurrentLimit);
    } catch (err) {
      console.error("Failed to update ban status:", err);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchModerator(search.trim());
        const mod = res.data;
        const processedData = mod.slice(0, modCurrentLimit);
        setSearchResults(processedData);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="rounded-md bg-white flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <Header
          title="Moderator Management"
          des="Create, edit and manage moderators "
          button="Add Moderator"
          onClick={() => {
            setEditingModerator(null);
            setAddModerator(true);
          }}
          placeholder="Search Moderators..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="h-[calc(100vh-320px)] 2xl:h-[calc(100vh-350px) rounded-md border border-border">
              {membersToShow.length > 0 ? (
                <table className="w-full h-full table-auto">
                  <thead>
                    <tr className="table-row">
                      <th className="cell w-16 rounded-l-lg">S.N.</th>
                      <th className="cell">Full Name</th>
                      <th className="cell">Email</th>
                      <th className="cell w-32">Role</th>
                      <th className="cell">Details</th>
                      <th className="cell">Status</th>
                      <th className="cell w-24 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersToShow.map((mod, i) => (
                      <tr key={String(mod?.id)} className="table-data">
                        <td className="cell">
                          {(modCurrentPage - 1) * modCurrentLimit + i + 1}
                        </td>
                        <td className="cell truncate">
                          {mod?.firstName} {mod?.lastName}
                        </td>
                        <td className="cell max-w-xs truncate">{mod?.email}</td>
                        <td className="cell truncate">
                          <span className="bg-[#DBEAFE] rounded-2xl px-3 py-1.5 text-[10px] 2xl:text-xs text-[#003A88]">
                            {mod?.roles}
                          </span>
                        </td>
                        <td className="cell">
                          <button
                            onClick={() => {
                              setEditingModerator(mod);
                              setAddModerator(true);
                            }}
                            className=" bg-blue-500 text-white rounded-md text-xs px-2 py-1 cursor-pointer text-center"
                          >
                            View
                          </button>
                        </td>
                        <td className="cell">
                          <span
                            className={`px-2 py-1 text-[#0F6B30] text-sm rounded-2xl ${
                              mod.isActive
                                ? "bg-[#DBFCE7] text-[#0F6B30] "
                                : "bg-[#F5DFDF] text-[#BE0000]"
                            }`}
                          >
                            {mod.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="cell">
                          <div className="flex items-center justify-center gap-2 text-base 2xl:text-xl">
                            <FaBan
                              className={`cursor-pointer ${mod.isBanned ? "text-green-500" : "text-red-500"}`}
                              onClick={() =>
                                handleToggleBan(Number(mod.id), mod.isBanned)
                              }
                              title={mod.isBanned ? "Unban User" : "Ban User"}
                            />

                            <MdDeleteOutline
                              className="text-orange-500 cursor-pointer text-xl "
                              onClick={() => handleDelete(mod.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/*  Empty rows */}
                    {Array.from({
                      length:
                        modCurrentLimit -
                        (membersToShow.length ?? modCurrentLimit),
                    }).map((_, index) => (
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
                <NoDataCard message="No moderators available at the moment." />
              )}
              {!isSearching && (
                <Pagination
                  currentPage={modCurrentPage}
                  totalPages={modTotalPages}
                  totalItems={modTotalItems}
                  itemsPerPage={modCurrentLimit}
                  onPageChange={(page) =>
                    fetchModerators(page, modCurrentLimit)
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
      {addModerator && (
        <UserModal
          roleToShow="MODERATOR"
          closeForm={closeForm}
          onSubmit={handleAddOrEdit}
          initialData={editingModerator}
          title={editingModerator ? "Edit Moderator" : "Create New Moderator"}
          des={
            editingModerator
              ? "Update MODERATOR info"
              : "Add a new mod to the system"
          }
          btn1={editingModerator ? "Save" : "Create"}
        />
      )}
    </section>
  );
};

export default Moderator;
