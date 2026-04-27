

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { getSimulationData } from "./calculation.api";
interface BreedData {
  date: string;
  count: number;
}

interface CalculationData {
  breeder: BreedData[];
  broiler: BreedData[];
  layer: BreedData[];
}

interface ChartsProps {
  calculationData: { data: CalculationData } | null;
  isLoading: boolean;
  filters: {
    filterByBreed: string;
    startDate: string;
    endDate: string;
  };
  resetTrigger?: number;   // ← ADDED
  onSimulationUpdate?: (data: { count: any; data: CalculationData } | null) => void;
}

interface FormData {
  fertilityRate: number;
  mortalityRate: number;
  hatchabilityRate: number;
  eggProductionRate: number;
}

const Charts = ({ calculationData, isLoading, filters, resetTrigger = 0, onSimulationUpdate }: ChartsProps) => {
  const [formData, setFormData] = useState<FormData>({
    fertilityRate: 0,
    mortalityRate: 0,
    hatchabilityRate: 0,
    eggProductionRate: 0,
  });

  const [selectedBreed, setSelectedBreed] =
    useState<"All" | "breeder" | "broiler" | "layer">("breeder");

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(e.target.value as "All" | "breeder" | "broiler" | "layer");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationData, setSimulationData] = useState<CalculationData | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSimulationLoading(true);

      const response = await getSimulationData({
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        breedId: filters.filterByBreed
          ? Number(filters.filterByBreed)
          : 0,
        hatcheryId: 0,
        fertilityRate: formData.fertilityRate,
        mortalityRate: formData.mortalityRate,
        hatchabilityRate: formData.hatchabilityRate,
        eggProductionRate: formData.eggProductionRate,
      });

      if (response?.data) {
        setSimulationData(response.data);
        if (onSimulationUpdate) {
          onSimulationUpdate({ count: response.count, data: response.data });
        }
      }
    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setSimulationLoading(false);
    }
  };

  // ADDED: Reset simulation form and data when resetTrigger changes (triggered from parent when Filter is clicked)
  useEffect(() => {
    setFormData({
      fertilityRate: 0,
      mortalityRate: 0,
      hatchabilityRate: 0,
      eggProductionRate: 0,
    });
    setSimulationData(null);
    if (onSimulationUpdate) onSimulationUpdate(null);
  }, [resetTrigger]);

  // =========================
  // PREPARE CHART DATA (USE SIMULATION IF AVAILABLE)
  // =========================
  const chartData = useMemo(() => {
    const dataSource = simulationData || calculationData?.data;
    if (!dataSource) return [];

    const { breeder = [], broiler = [], layer = [] } = dataSource;

    // Collect dates only for the relevant category
    let relevantDates: string[] = [];
    if (selectedBreed === "All") {
      relevantDates = Array.from(
        new Set([...breeder, ...broiler, ...layer].map((d) => d.date))
      );
    } else {
      const specificData = (dataSource as any)[selectedBreed] || [];
      relevantDates = specificData.map((d: any) => d.date);
    }

    const dates = relevantDates.sort();

    return dates.map((date) => ({
      date,
      breeder: breeder.find((b) => b.date === date)?.count ?? null,
      broiler: broiler.find((b) => b.date === date)?.count ?? null,
      layer: layer.find((l) => l.date === date)?.count ?? null,
    }));
  }, [calculationData, simulationData, selectedBreed]);


  if (isLoading) {
    return (
      <main className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* ========================= */}
        {/* CHART SKELETON */}
        {/* ========================= */}
        <section className="border border-border rounded-md p-4 flex-1 lg:w-[70%] flex flex-col gap-4 bg-white shadow-sm animate-pulse min-h-[600px]">

          {/* Title Skeleton */}
          <div>
            <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          {/* Dropdown Skeleton */}
          <div className="h-8 w-40 bg-gray-300 rounded"></div>

          {/* Chart Area Skeleton */}
          <div className="h-[500px] bg-gray-300 rounded-lg"></div>
        </section>

        {/* ========================= */}
        {/* PARAMETER SKELETON */}
        {/* ========================= */}
        <section className="border border-border rounded-lg lg:w-[30%] w-full px-4 py-5 flex flex-col gap-6 bg-white shadow-sm animate-pulse min-h-[600px]">

          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
          </div>

          {/* Slider Skeletons */}
          <div className="flex flex-col gap-5">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="h-10 w-28 bg-gray-400 rounded-lg mt-4"></div>

          {/* Note Skeleton */}
          <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
        </section>
      </main>
    );
  }

  // =========================
  // Y-AXIS MAX (rounded +10%)
  // =========================
  const maxVal =
    chartData.length > 0
      ? selectedBreed === "All"
        ? Math.max(...chartData.map((d) => Math.max(d.breeder ?? 0, d.broiler ?? 0, d.layer ?? 0)))
        : Math.max(...chartData.map((d) => (d[selectedBreed as "breeder" | "broiler" | "layer"] ?? 0)))
      : 100;

  // add 10% extra and round to nearest 10
  const yMax = Math.ceil(maxVal * 1.1 / 10) * 10;

  // =========================
  // MONTHLY TICKS (12 per year)
  // =========================
  const monthlyTicks = chartData
    .filter((d, index, arr) => {
      if (index === 0) return true;
      const currentMonth = new Date(d.date).getMonth();
      const prevMonth = new Date(arr[index - 1].date).getMonth();
      return currentMonth !== prevMonth;
    })
    .map((d) => d.date);

  // =========================
  // YEAR TICKS (only label these)
  // =========================
  const yearTicks = chartData
    .filter((d, index, arr) => {
      if (index === 0) return true;
      const currentYear = new Date(d.date).getFullYear();
      const prevYear = new Date(arr[index - 1].date).getFullYear();
      return currentYear !== prevYear;
    })
    .map((d) => d.date);


  const formatYear = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  // =========================
  // EMPTY DATA CHECK
  // =========================
  const isNoData =
    chartData.length === 0 ||
    chartData.every(
      (d) => {
        return (d.breeder ?? 0) === 0 && (d.broiler ?? 0) === 0 && (d.layer ?? 0) === 0;
      }
    );

  return (
    <main className="flex flex-col lg:flex-row gap-6 flex-1">
      {/* ========================= */}
      {/* CHART SECTION */}
      {/* ========================= */}
      <section className="border border-border rounded-md p-4 flex-1 lg:w-[70%] flex flex-col gap-4 bg-white shadow-sm">
        <div>
          <h1 className="text-lg font-bold mb-1">Breed Counts Over Time</h1>
          <span className="text-sm text-gray-500">
            Monthly counts for breeder, broiler, and layer breeds
          </span>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Select Breed:</label>
          <select
            value={selectedBreed}
            onChange={handleBreedChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="All">All</option>
            <option value="breeder">Breeder</option>
            <option value="broiler">Broiler</option>
            <option value="layer">Layer</option>
          </select>
        </div>

        {isNoData ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v18h18"
              />
            </svg>

            <h3 className="text-base font-semibold">No Data Available</h3>
            <p className="text-sm text-gray-400 mt-1 text-center">
              There is no production data for the selected filters.
              <br />
              Try adjusting date range or breed.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 14, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" ticks={yearTicks} tickFormatter={formatYear} />

              <YAxis domain={[0, yMax]} tickFormatter={(value) => `${value}`} />

              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                }
              />

              <Legend verticalAlign="top" />

              {monthlyTicks.map((tick) => (
                <ReferenceLine key={tick} x={tick} stroke="#e5e7eb" strokeWidth={1} />
              ))}

              {yearTicks.map((tick) => (
                <ReferenceLine
                  key={`year-${tick}`}
                  x={tick}
                  stroke="#9ca3af"
                  strokeWidth={2}
                />
              ))}

              {selectedBreed === "All" ? (
                <>
                  <Line type="monotone" dataKey="breeder" stroke="#FF5733" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="broiler" stroke="#33C3FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="layer" stroke="#33FF77" strokeWidth={2} dot={false} />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey={selectedBreed}
                  stroke={
                    selectedBreed === "breeder"
                      ? "#FF5733"
                      : selectedBreed === "broiler"
                        ? "#33C3FF"
                        : "#33FF77"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ========================= */}
      {/* PARAMETER SECTION */}
      {/* ========================= */}
      <section className="border border-border rounded-lg w-[30%] px-3 py-4 flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-base tracking-wide font-semibold">Adjust Parameter</h2>
          <button
            type="button"
            className="border border-border text-xs p-1 rounded-md"
            onClick={() => {
              setFormData({
                fertilityRate: 0,
                mortalityRate: 0,
                hatchabilityRate: 0,
                eggProductionRate: 0,
              });
              setSimulationData(null);
              if (onSimulationUpdate) onSimulationUpdate(null);
            }}
          >
            Restore defaults
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4">
          {[
            "fertilityRate",
            "mortalityRate",
            "hatchabilityRate",
            "eggProductionRate",
          ].map((key) => (
            <div key={key} className="input-range">
              <label className="input-label">{key.replace(/([A-Z])/g, " $1")}</label>
              <input
                type="range"
                min="0"
                max="100"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleInputChange}
                className="bg-black text-black"
              />
            </div>
          ))}
          <div className="flex">

            <button
              type="submit"
              className="bg-primary text-white rounded-lg py-2 px-5 cursor-pointer text-sm"
            >
              Simulate
            </button>
          </div>
          <p className="text-xs text-secondary">
            Note: Simulation changes are temporary and for analysis only.
          </p>
        </form>
      </section>
    </main>
  );
};

export default Charts;