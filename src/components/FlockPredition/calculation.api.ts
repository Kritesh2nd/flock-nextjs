import axiosInstance from "@/lib/axios.utils";

interface CalculationFilter {
  startDate: string | null;
  endDate: string | null;
  purpose: "LAYER" | "BROILER" | "BREEDER" | null;
  breedId: number;
  hatcheryId: number;
}

// simulation.api.ts

export interface SimulationFilter {
  startDate: string | null;
  endDate: string | null;
  breedId: number;
  hatcheryId: number;
  fertilityRate: number;
  mortalityRate: number;
  hatchabilityRate: number;
  eggProductionRate: number;
}
export const getCalculationData = async (filters: CalculationFilter) => {
  try {
    const res = await axiosInstance.post("/calculations/data", filters);
    return res.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return null; // or throw error
  }
};
export const getSimulationData = async (filters: SimulationFilter) => {
  try {
    const response = await axiosInstance.post(
      "/calculations/simulation",
      filters,
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Simulation API Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
