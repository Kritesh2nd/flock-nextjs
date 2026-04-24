"use client";
import { FlockFormType, FlockPropsType } from "@/types";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  addFlockData,
  deleteFlock,
  getAllFlocks,
  getHatcheryById,
} from "@/components/AllHatcheries/action";
import NoDataCard from "@/components/common/NoData";
import FlockModal from "@/components/AllHatcheries/FlockModal";
import Pagination from "@/components/common/Pagination";
import { useParams, useRouter } from "next/navigation";
import { PiFarm } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import PaymentModal from "@/components/AllHatcheries/PaymentModal";

const HatcheryDetails = () => {
  const { id } = useParams();
  const hatcheryId = Number(id);
  const [hatcheryData, setHatcheryData] = useState<any>({});
  const [selected, setSelected] = useState<
    "Hatchery Details" | "Flock Details"
  >("Hatchery Details");
  const [addFlocks, setAddFlocks] = useState(false);
  const [loadFlocks, setLoadFlocks] = useState<FlockPropsType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [selectedFlock, setSelectedFlock] = useState<FlockPropsType | null>(
    null,
  );
  const router = useRouter();

  const onClose = () => {
    setAddFlocks(false);
  };
  const fetchHatcheryById = async () => {
    try {
      setIsLoading(true);
      const Hatchery = await getHatcheryById(hatcheryId);
      setHatcheryData(Hatchery);
    } catch (err) {
      console.error("Unable to load Hatcheries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFlocks = async (page = 1, limit = 6) => {
    try {
      const res = await getAllFlocks(hatcheryId, page, limit);
      const flocks = res?.data;
      const meta = res.metadata;
      setCurrentLimit(meta.currentLimit);
      setCurrentPage(meta.currentPage);
      setTotalItems(meta.totalItems);
      setTotalPages(meta.totalPages);
      setLoadFlocks(flocks);
    } catch (err) {
      console.error("Error fetching breeds:", err);
    }
  };

  useEffect(() => {
    fetchFlocks();
  }, []);

  const handleAddFlock = async (data: FlockFormType) => {
    try {
      const res = await addFlockData(data);
      const newFlock = res?.flock;
      toast.success("Flock added successfully.");
      onClose();
      await fetchFlocks();
      return newFlock;
    } catch (error) {
      console.error("Error adding flocks:", error);
      toast.error("Unable to Add Flock");
    }
  };

  useEffect(() => {
    fetchHatcheryById();
  }, []);

  const hatchId = hatcheryData.id;
  const hatchName = hatcheryData?.hatcheryName;

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteFlock(id);
      fetchFlocks();
      toast.success("Deleted successfully.");
    } catch (err) {
      console.error("Unable to delete flock:", err);
      toast.error("Cannot delete Flock.");
    }
  };

  if (isLoading)
    return (
      <section className="flex flex-col gap-4 animate-pulse">
        {/* Back arrow */}
        <div className="h-5 w-5 bg-gray-300 rounded" />

        {/* Tabs */}
        <div className="flex gap-2">
          <div className="h-9 w-40 bg-gray-200 rounded-lg" />
          <div className="h-9 w-40 bg-gray-100 rounded-lg" />
        </div>

        {/* Main card */}
        <div className="rounded-md bg-white shadow-sm border border-border px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 bg-gray-300 rounded" />
            <div className="h-6 w-64 bg-gray-300 rounded" />
          </div>

          <div className="h-4 w-40 bg-gray-200 rounded" />

          <div className="flex justify-between mt-2">
            <div className="flex flex-col gap-3">
              <div className="h-4 w-56 bg-gray-200 rounded" />
              <div className="h-4 w-72 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>

            <div className="flex flex-col gap-3 items-end">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-8 w-28 bg-gray-300 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section className="flex flex-col gap-4">
      <FaArrowLeft
        className="cursor-pointer"
        onClick={() => router.push("/dashboard/all-hatcheries")}
      />

      <div className="flex gap-2">
        {["Hatchery Details", "Flock Details"].map((item) => (
          <button
            key={item}
            className={`text-base duration-200 transition-all rounded-lg px-4 py-2 shadow-sm cursor-pointer ${
              selected === item ? "bg-[#D9D9D966]/70" : "bg-white"
            }`}
            onClick={() => setSelected(item as any)}
          >
            {item}
          </button>
        ))}
      </div>
      {selected === "Hatchery Details" && (
        <>
          <div className="rounded-md bg-white shadow-sm border border-border px-4 py-4 flex flex-col gap-3">
            <div className="flex gap-4 items-center font-bold">
              <PiFarm size={24} />
              <span className="text-2xl">{hatcheryData?.hatcheryName}</span>
            </div>
            <span className="flex gap-2">
              <span className="font-semibold">Owner Name:</span>{" "}
              {hatcheryData?.ownerName}
            </span>
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <span className="flex gap-2">
                  <span className="font-semibold"> Registered Number: </span>
                  {hatcheryData?.registrationNumber}
                </span>
                <span className="flex gap-2">
                  <div className="font-semibold">Address:</div>
                  {hatcheryData?.address}
                </span>
                <span className="flex gap-2">
                  <div className="font-semibold"> Contact:</div>{" "}
                  {hatcheryData?.contactNumber}
                </span>
              </div>
              <div className="px-4 flex flex-col items-end justify-end gap-3">
                <span className="flex gap-2">
                  <span className="font-semibold">Status: </span>
                  <span
                    className={`${hatcheryData?.isActive ? "text-[#00A63D]" : "text-red-600"} flex items-center gap-0.5`}
                  >
                    <div
                      className={`${hatcheryData?.isActive ? " bg-[#00A63D] " : "bg-red-500"}h-2 w-2 rounded-full`}
                    />
                    {hatcheryData?.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      {selected === "Flock Details" && (
        <div className="rounded-md py-3 2xl:py-4 px-6 bg-white border border-border flex flex-col gap-2 h-[72vh] 2xl:h-[77vh]">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-medium text-primary">
                Production Data Entry
              </h1>
              <span className="text-base text-secondary">
                Record intake data
              </span>
            </div>
            <div className="">
              <button
                className="bg-primary rounded-lg text-sm flex gap-1 items-center text-white px-2 py-2 cursor-pointer"
                onClick={() => {
                  setAddFlocks(true);
                }}
              >
                <FaPlus />
                <span>Record Intake</span>
              </button>
            </div>
          </div>
          <div className="rounded-md overflow-auto mt-2">
            {loadFlocks && loadFlocks.length > 0 ? (
              <table className="w-full table-fixed">
                <thead>
                  <tr className="table-row">
                    <th className="cell w-10">S.N.</th>
                    <th className="cell w-20">Breed</th>
                    <th className="cell w-20">Male</th>
                    <th className="cell w-20">Female</th>
                    <th className="cell w-20">Male (free)</th>
                    <th className="cell w-20">Female (free)</th>
                    <th className="cell w-20">Purpose</th>
                    <th className="cell w-20">Date</th>
                    <th className="cell w-20">Due</th>
                    <th className="cell w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadFlocks.map((flock, i) => (
                    <tr key={flock.id} className="table-data">
                      <td className="cell">
                        {(currentPage - 1) * currentLimit + i + 1}
                      </td>
                      <td className="cell">{flock.breed?.name}</td>
                      <td className="cell">{flock.maleChickCount}</td>
                      <td className="cell">{flock.femaleChickCount}</td>
                      <td className="cell">{flock.maleChickCountFree}</td>
                      <td className="cell">{flock.femaleChickCountFree}</td>
                      <td className="cell">{flock.productionPurpose}</td>
                      <td className="cell">{flock.dateOfBirth}</td>
                      <td className="cell">
                        Rs. {flock.financials.remainingDues ?? 0}
                      </td>

                      <td className="cell">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedFlock(flock);
                              setOpenPay(true);
                            }}
                            className="text-[10px] bg-green-400 text-white rounded-lg px-2 py-1 cursor-pointer"
                          >
                            Pay
                          </button>
                          <MdDeleteOutline
                            onClick={() => handleDelete(flock.id)}
                            className="cursor-pointer text-red-500 text-base 2xl:text-lg"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoDataCard message="No flock data found." />
            )}
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              totalPages={totalPages}
              itemsPerPage={currentLimit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
      {addFlocks && (
        <FlockModal
          closeForm={onClose}
          onSubmit={handleAddFlock}
          preselectedHatchery={{
            id: hatcheryId,
            name: hatcheryData?.hatcheryName,
          }}
        />
      )}
      {openPay && selectedFlock && (
        <PaymentModal
          flock={selectedFlock}
          onClose={() => setOpenPay(false)}
          hatcheryId={hatchId}
          hatcheryName={hatchName}
          onPaymentSuccess={() => fetchFlocks(currentPage, currentLimit)}
        />
      )}
    </section>
  );
};

export default HatcheryDetails;
