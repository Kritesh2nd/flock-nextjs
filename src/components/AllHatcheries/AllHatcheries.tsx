"use client";
import { useEffect, useState } from "react";
import Header from "../common/Header";
import { FlockFormType, HatcheryPropsType } from "@/types";
import { MdDeleteOutline } from "react-icons/md";
import NoDataCard from "../common/NoData";
import Pagination from "../common/Pagination";
import HatcheryModal from "./HatcheryModal";
import FlockModal from "./FlockModal";

import {
  addFlockData,
  addHatchery,
  deleteHatchery,
  getAllHatcheries,
  searchHatchery,
  updateHatchery,
} from "./action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { truncateText } from "@/utils/truncateText";
import Link from "next/link";
import TableSkeleton from "../loader/TableLoader";
import { FiEdit } from "react-icons/fi";

const AllHatcheries = () => {
  const [addHatcheries, setAddHatcheries] = useState(false);
  const [addFlocks, setAddFlocks] = useState(false);
  const [loadHatcheries, setLoadHatcheries] = useState<HatcheryPropsType[]>([]);
  const [editingHatcheries, setEditingHatcheries] =
    useState<HatcheryPropsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(7);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const closeForm = () => {
    setAddHatcheries(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHatchery(id);

      fetchHatcheries(currentPage, currentLimit);

      toast.success("Hatchery deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete hatchery");
    }
  };
  const fetchHatcheries = async (page = 1, limit = 7) => {
    try {
      setIsLoading(true);
      const res = await getAllHatcheries(page, limit);
      const hatcheries = res?.data || [];
      const meta = res?.metadata || {};

      setCurrentLimit(meta.limit);
      setCurrentPage(meta.page);
      setTotalItems(meta.total);
      setTotalPages(meta.totalPages);
      setLoadHatcheries(hatcheries);
    } catch (err) {
      console.error("Error fetching hatcheries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const EMPTY_ROWS_COUNT =
    loadHatcheries.length < currentLimit
      ? currentLimit - loadHatcheries.length
      : 0;

  const handleEditorAddHatcheries = async (data: HatcheryPropsType) => {
    try {
      if (editingHatcheries) {
        if (!editingHatcheries.id) {
          toast.error("Missing hatchery id for update");
          return;
        }
        const payload = {
          ...data,
        };

        try {
          const res = await updateHatchery(editingHatcheries.id, payload);
          const updated = res.data?.hatchery || res.data || res;

          setLoadHatcheries((prev) =>
            prev.map((h) => (h.id === editingHatcheries.id ? updated : h)),
          );
          // await fetchHatcheries(currentPage, currentLimit);

          setEditingHatcheries(null);
          setAddHatcheries(false);
          toast.success("Hatchery updated successfully");
        } catch (err: any) {
          console.error("Update failed:", err.response?.data || err.message);
          toast.error(
            err.response?.data?.message || "Failed to update hatchery",
          );
        }
      } else {
        const newHatchery = await addHatchery({ ...data });
        const res = newHatchery.data;

        fetchHatcheries(currentPage, currentLimit);
        toast.success("Hatchery added successfully.");
        setAddHatcheries(false);
        return res;
      }
    } catch (err) {
      console.error("Failed");
    }
  };

  const onClose = () => {
    setAddFlocks(false);
  };

  const handleAddFlock = async (data: FlockFormType) => {
    try {
      const res = await addFlockData(data);
      const newFlock = res?.flock;
      toast.success("Flock added successfully.");
      onClose();
      return newFlock;
    } catch (error) {
      console.error("Error adding flocks:", error);
      toast.error("Unable to Add Flock");
    }
  };
  const membersToShow = isSearching
    ? searchResults || []
    : loadHatcheries || [];

  useEffect(() => {
    if (addHatcheries) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addHatcheries]);

  useEffect(() => {
    if (addFlocks) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addFlocks]);

  useEffect(() => {
    fetchHatcheries(currentPage, currentLimit);
  }, [currentPage, currentLimit]);

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchHatchery(search.trim());
        const data = res.data;
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="rounded-md bg-white flex flex-col gap-2">
      <div className="flex flex-col gap-4 h-full">
        <Header
          title="All Hatcheries"
          des="View all registered hatcheries in the system"
          button="Add Hatchery Farm"
          button2="Add Flock Details"
          onClick={() => {
            setEditingHatcheries(null);
            setAddHatcheries(true);
          }}
          onClick1={() => {
            setAddFlocks(true);
          }}
          placeholder="Search Hatcheries..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <>
          {isLoading ? (
            <TableSkeleton rows={7} columns={8} />
          ) : (
            <div className="h-[calc(100vh-295px)] 2xl:h-[calc(100vh-280px) rounded-lg">
              {membersToShow && membersToShow.length > 0 ? (
                <table className="w-full h-full table-auto">
                  <thead>
                    <tr className="table-row">
                      <th className="cell w-16 rounded-tl-lg">S.N.</th>
                      <th className="cell w-40">Name</th>
                      <th className="cell w-34">Address</th>
                      <th className="cell w-32">Registered Number</th>
                      <th className="cell w-28">Owner</th>
                      <th className="cell w-36">Contact</th>
                      <th className="cell w-30">Due.</th>
                      <th className="cell w-24 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membersToShow.map((hatch, i) => (
                      <tr key={hatch?.id} className="table-data">
                        <td className="cell">
                          {(currentPage - 1) * currentLimit + i + 1}
                        </td>
                        <td className="cell truncate">
                          {truncateText(hatch?.hatcheryName, 20)}
                        </td>
                        <td className="cell truncate">
                          {truncateText(hatch?.address, 12)}
                        </td>
                        <td className="cell truncate">
                          {truncateText(hatch?.registrationNumber, 10)}
                        </td>
                        <td className="cell underline truncate">
                          {hatch.owner ? (
                            <Link
                              href={`/dashboard/user-management?editUser=${hatch.ownerId}`}
                              className="truncate"
                            >
                              {`${hatch.owner.firstname ?? ""} ${hatch.owner.lastname ?? ""}`}
                            </Link>
                          ) : (
                            <span className="opacity-50 cursor-not-allowed">
                              {hatch.ownerName}
                            </span>
                          )}
                        </td>
                        <td className="cell truncate">
                          {truncateText(hatch?.contactNumber, 11)}
                        </td>

                        <td className="cell truncate">
                          Rs. {hatch?.paymentData?.totalRemainingAmount ?? 0}
                        </td>

                        <td className="cell truncate">
                          <div className="flex gap-1 items-center justify-center text-secondary">
                            <FiEdit
                              className="text-blue-300 cursor-pointer text-base"
                              onClick={() => {
                                setEditingHatcheries(hatch);
                                setAddHatcheries(true);
                              }}
                            />
                            <MdDeleteOutline
                              className="text-red-500 cursor-pointer text-base"
                              onClick={() => handleDelete(hatch.id!)}
                            />
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/all-hatcheries/${hatch.id}`,
                                )
                              }
                              className={`${hatch.isActive ? "cursor-pointer" : "cursor-not-allowed opacity-50"} bg-blue-500 text-white rounded-md text-[10px] px-1 py-0.5 cursor-pointer`}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/*  Empty rows */}
                    {Array.from({
                      length:
                        currentLimit - (membersToShow.length ?? currentLimit),
                    }).map((_, index) => (
                      <tr key={`empty-row-${index}`}>
                        <td className="cell">&nbsp;</td>
                        <td className="cell">&nbsp;</td>
                        <td className="cell">&nbsp;</td>
                        <td className="cell">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NoDataCard message="No Hatcheries" />
              )}
              {!isSearching && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  totalPages={totalPages}
                  itemsPerPage={currentLimit}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          )}
        </>
      </div>

      {addHatcheries && (
        <HatcheryModal
          closeForm={closeForm}
          onSubmit={handleEditorAddHatcheries}
          initialData={editingHatcheries}
          btn={editingHatcheries ? "Update" : "Save"}
          title={editingHatcheries ? "Edit Hatchery" : "Add Hatchery Farm"}
          des={
            editingHatcheries
              ? "Update Hatchery info"
              : "Register a new hatchery farm in the system"
          }
        />
      )}
      {addFlocks && (
        <FlockModal closeForm={onClose} onSubmit={handleAddFlock} />
      )}
    </section>
  );
};

export default AllHatcheries;
