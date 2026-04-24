"use client";

import InputCard from "@/components/common/InputField";
import SelectCard from "@/components/common/SelectCard";
import Charts from "@/components/FlockPredition/Charts";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getCalculationData } from "@/components/FlockPredition/calculation.api";
import { useBreedStore } from "@/store/breedStandardStore";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
import Header from "@/components/common/Header";
import GenerateReportModal from "@/components/FlockPredition/GenerateReport";
import { getHatcheries } from "@/components/AllHatcheries/action";
import { CiSearch } from "react-icons/ci";
import { useAuthStore } from "@/store/authstore";

interface FormData {
  category: string;
  filterByBreed: number | null;
  startDate: string | null;
  endDate: string | null;
  production: "" | "week" | "month" | "year";
  hatchery: { hatcheryId: string; hatcheryName: string };
}

interface TimeOption {
  value: string;
  option: string;
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

const getPeriodDates = (
  period: FormData["production"],
): { start: string | null; end: string | null } => {
  if (!period) return { start: null, end: null };

  const today = new Date();

  if (period === "week") {
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay()); // Sunday
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // Saturday
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  if (period === "month") {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  if (period === "year") {
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  return { start: null, end: null };
};

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

const FlockPrediction = () => {
  const { loadBreed } = useBreedStore();

  const [formData, setFormData] = useState<FormData>({
    category: "",
    filterByBreed: null,
    startDate: null,
    endDate: null,
    production: "",
    hatchery: {
      hatcheryId: "",
      hatcheryName: "",
    },
  });

  const [calculationData, setCalculationData] = useState<any>(null);
  const [simulatedData, setSimulatedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generateReport, setGenerateReport] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0); // triggers reset in Charts
  const [allHatcheries, setAllHatcheries] = useState<
    { id: number; hatcheryName: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHatcheries, setFilteredHatcheries] = useState<
    { id: number; hatcheryName: string }[]
  >([]);
  const [selectedHatchery, setSelectedHatchery] = useState<{
    id: number;
    hatcheryName: string;
  } | null>(null);
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const timeOptions: TimeOption[] = [
    { value: "", option: "Select Time Period" },
    { value: "week", option: "Current Week" },
    { value: "month", option: "Current Month" },
    { value: "year", option: "Current Year" },
  ];
  const generations = Array.from(
    new Set(loadBreed?.map((b) => b.generation) ?? []),
  );

  const fetchHatcheries = async () => {
    if (role === "SUPER_ROLE") {
      const res = await getHatcheries();
      setAllHatcheries(res?.data ?? []);
    } else return [];
  };

  const handleSelectHatchery = (hatchery: {
    id: number;
    hatcheryName: string;
  }) => {
    setFormData((prev) => ({ ...prev, hatcheryId: hatchery.id })); // save ID
    setSelectedHatchery(hatchery);
    setSearchQuery(hatchery.hatcheryName); // update input
    setFilteredHatcheries([]);
  };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      let startDate = formData.startDate;
      let endDate = formData.endDate;

      if (formData.production) {
        const { start, end } = getPeriodDates(formData.production);
        startDate = start;
        endDate = end;
      }
      const hatcheryId = role === "SUPER_ROLE" ? selectedHatchery?.id || 0 : 0;

      const payload = {
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        purpose: null,
        breedId: formData.filterByBreed ? Number(formData.filterByBreed) : 0,
        hatcheryId,
      };

      const data = await getCalculationData(payload);
      setCalculationData(data);
    } catch (error) {
      console.error("Error fetching calculation data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    formData.filterByBreed,
    formData.startDate,
    formData.endDate,
    formData.production,
    selectedHatchery,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchHatcheries();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredHatcheries([]);
        return;
      }

      const filtered = allHatcheries.filter((h) =>
        h?.hatcheryName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredHatcheries(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, allHatcheries]);

  const handleFilter = () => {
    fetchData();
    setSimulatedData(null);
    setResetTrigger((prev) => prev + 1);
  };

  const getPredictionData = (count: any = {}) => [
    {
      id: 1,
      img: "/flockpredicon/Egg.png",
      title: "Egg Production",
      des: "Estimated Fertile eggs",
      size: count?.eggProduction?.toLocaleString() ?? "0",
    },
    {
      id: 2,
      img: "/flockpredicon/roast.png",
      title: "Meat Production",
      des: "Predicted mature adults",
      size: count?.meatProduction?.toLocaleString() ?? "0",
    },
    {
      id: 3,
      img: "/flockpredicon/chick.png",
      title: "Chicks Production",
      des: "Predicted healthy hatchlings",
      size: count?.chicksProduction?.toLocaleString() ?? "0",
    },
  ];

  const getColor = (title: string) => {
    switch (title) {
      case "Meat Production":
        return "border-l-4 border-l-red-500 text-red-500";
      case "Egg Production":
        return "border-l-4 border-l-orange-400 text-orange-400";
      case "Chicks Production":
        return "border-l-4 border-l-blue-500 text-blue-500";
      default:
        return "border-l-4 border-l-yellow-500 text-yellow-500";
    }
  };

  const predictionCards = getPredictionData(
    simulatedData?.count || calculationData?.count,
  );

  return (
    <main className="flex flex-col gap-6">
      <section className="flex flex-col md:gap-3 lg:gap-4 xl:gap-5">
        <header className="flex flex-col gap-1 rounded-md border border-border px-4 py-4 bg-white shadow-sm">
          <Header
            title="Flock Data"
            des="Interactive charts showing production trends and distributions"
            button="Generate Report"
            onClick={() => setGenerateReport(true)}
          />

          <div className="flex gap-4 py-3">
            {role === "SUPER_ROLE" && (
              <>
                <div className="flex flex-col w-full relative">
                  <h5 className="text-sm font-medium mb-1.5">Hatchery Name</h5>
                  {/* Search input */}
                  <div className="relative w-full">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg" />
                    <input
                      type="text"
                      placeholder="Search Hatchery"
                      className="border border-border rounded-lg px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedHatchery(null);
                      }}
                    />
                  </div>

                  {/* Dropdown results */}
                  {filteredHatcheries &&
                    filteredHatcheries.length > 0 &&
                    !selectedHatchery && (
                      <div className="absolute top-full -left-3 border border-border w-full max-h-40 overflow-y-auto rounded-md bg-white shadow-lg z-50 ml-3">
                        {filteredHatcheries.map((hatchery) => (
                          <div
                            key={hatchery.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectHatchery(hatchery)}
                          >
                            {hatchery.hatcheryName}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </>
            )}

            {/* Breed Filter */}
            <div className="flex flex-col min-w-60">
              <h5 className="text-sm font-medium mb-1.5">Filter By Breed</h5>
              <select
                value={formData.filterByBreed ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    filterByBreed: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">All Breeds</option>
                {generations.map((gen) =>
                  gen === "PARENT" ? null : (
                    <optgroup key={gen} label={gen}>
                      {loadBreed
                        .filter((b) => b.generation === gen)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                    </optgroup>
                  ),
                )}
              </select>
            </div>

            {/* Start Date */}
            <InputCard
              title="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: e.target.value || null,
                }))
              }
              placeholder=""
            />

            {/* End Date */}
            <InputCard
              title="End Date"
              name="endDate"
              type="date"
              value={formData.endDate ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: e.target.value || null,
                }))
              }
              placeholder=""
            />

            {/* Quick Period */}
            <SelectCard
              name="production"
              title="Production period"
              value={formData.production ?? ""}
              onChange={(e) => {
                const value = e.target.value as FormData["production"];
                const { start, end } = getPeriodDates(value);

                setFormData((prev) => ({
                  ...prev,
                  production: value,
                  startDate: start,
                  endDate: end,
                }));
              }}
              options={timeOptions}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              Showing {loadBreed.length} breed
              {loadBreed.length !== 1 ? "s" : ""}
            </span>

            <button
              onClick={handleFilter}
              disabled={loading}
              className={`rounded-lg px-6 py-2 text-sm font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "Loading..." : "Filter"}
            </button>
          </div>
        </header>

        {/* Prediction Cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictionCards.map((pred) => (
            <li
              key={pred.id}
              className={`flex flex-col border border-border shadow-sm rounded-2xl px-5 py-5 gap-3 bg-white ${getColor(
                pred.title,
              )}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{pred.title}</h2>
                <Image
                  src={pred.img}
                  alt={pred.title}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{pred.size}</span>
                <span className="text-sm text-gray-600">{pred.des}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Charts */}
      <Charts
        calculationData={calculationData}
        isLoading={loading}
        filters={{
          filterByBreed: formData.filterByBreed
            ? String(formData.filterByBreed)
            : "",
          startDate: formData.startDate ?? "",
          endDate: formData.endDate ?? "",
        }}
        resetTrigger={resetTrigger} // triggers reset in Charts
        onSimulationUpdate={(data) => setSimulatedData(data)}
      />
      {generateReport && (
        <GenerateReportModal onClose={() => setGenerateReport(false)} />
      )}
    </main>
  );
};

export default FlockPrediction;
