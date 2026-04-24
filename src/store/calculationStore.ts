import { getAverageStandard, getChartData } from "@/app/(Protected_Routes)/(sub_protected_routes)/dashboard/calculation/action";
import { CalcFormData, CalcParamFormDataType, initialCalcParamFormData, initialStatePoultryData, ProductionDataMap, StandardPoultryData } from "@/types/calculation";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CalculationStore {
  calculationData: ProductionDataMap | null;
  isLoading: boolean;
  fetchCalculationData: () => Promise<void>;
  calcFormData: CalcFormData;

  setCalcFormData: (data: CalcFormData) => void;

  // standard data loading

  data: StandardPoultryData;
  formData: CalcParamFormDataType;
  setData: (newData: StandardPoultryData) => void,

  dataLoading: boolean;
  error: string | null;

  fetchAverageStats: () => Promise<void>;
  reset: () => void;
}

export const useCalculationStore = create<CalculationStore>((set, get) => ({
  calculationData: {
    totals: [],
    data: {
      BGP_MEAT: [],
      BP_MEAT: [],
      B_MEAT: [],
      LP_MEAT: [],
      L_MEAT: [],
      BP_CHICK: [],
      B_CHICK: [],
      L_CHICK: [],
      L_EGG: [],
    },
  },
  fetchCalculationData: async () => {
    set({ isLoading: true });

    const { calcFormData, data } = get();
    const mainFilterData: CalcFormData = { ...calcFormData, simulation: data };
    const calculation = await getChartData({ formData: mainFilterData });
    console.log(calculation, "this is response");
    set({ calculationData: calculation });

    set({ isLoading: false });
  },
  isLoading: false,

  calcFormData: {
    startDate: null,
    endDate: null,
    breedIds: [],
    hatcheryId: 0,
    simulation: null,
  },
  setCalcFormData: (data: CalcFormData) => {
    set({ calcFormData: data });
  },
  data: initialStatePoultryData,
  formData: initialCalcParamFormData,
  setData: (newData: StandardPoultryData) => {
    set({ data: newData });
  },
  dataLoading: false,
  error: null,


  fetchAverageStats: async () => {
    try {
      set({ dataLoading: true, error: null });

      const api = await getAverageStandard();

      // ---- Normalize once ----
      const newData: StandardPoultryData = {
        grandParent: {
          ...initialStatePoultryData.grandParent,
          averageParameter: {
            averageHatchableEggRate:
              formatToInteger(api.grandParent.averageParameter.averageHatchableEggRate),
            averageCumulativeMortalityRate:
              formatToInteger(api.grandParent.averageParameter.cumulativeMortalityRate),
            averageHatchingEggRate:
              formatToInteger(api.grandParent.averageParameter.averageHatchingEggRate),
          },
        },
        parent: {
          ...initialStatePoultryData.parent,
          averageParameter: {
            averageHatchableEggRate:
              formatToInteger(api.parent.averageParameter.averageHatchableEggRate),
            averageCumulativeMortalityRate:
              formatToInteger(api.parent.averageParameter.cumulativeMortalityRate),
            averageHatchingEggRate:
              formatToInteger(api.parent.averageParameter.averageHatchingEggRate),
          },
        },
        layer: {
          ...initialStatePoultryData.layer,
          averageParameter: {
            eggProductionRate: formatToInteger(api.layer.averageParameter.eggProductionRate),
            cumulativeMortalityRate:
              formatToInteger(api.layer.averageParameter.cumulativeMortalityRate),
            damagedEggRate: formatToInteger(api.layer.averageParameter.damagedEggRate),
          },
        },
        broiler: {
          ...initialStatePoultryData.broiler,
          averageParameter: {
            weight: formatToInteger(api.broiler.averageParameter.weight),
            cumulativeMortalityRate:
              formatToInteger(api.broiler.averageParameter.cumulativeMortalityRate),
          },
        },
      };

      // ---- Build formData from same source (not duplicated logic) ----
      const newFormData: CalcParamFormDataType = {
        grandparent: {
          averageHatchableEggRate:
            formatToInteger(api.grandParent.averageParameter.averageHatchableEggRate),
          averageCumulativeMortalityRate:
            formatToInteger(api.grandParent.averageParameter.cumulativeMortalityRate),
          averageHatchingEggRate:
            formatToInteger(api.grandParent.averageParameter.averageHatchingEggRate),
        },
        parent: {
          averageHatchableEggRate:
            formatToInteger(api.parent.averageParameter.averageHatchableEggRate),
          averageCumulativeMortalityRate:
            formatToInteger(api.parent.averageParameter.cumulativeMortalityRate),
          averageHatchingEggRate:
            formatToInteger(api.parent.averageParameter.averageHatchingEggRate),
        },
        broiler: {
          weight: formatToInteger(api.broiler.averageParameter.weight),
          cumulativeMortalityRate:
            formatToInteger(api.broiler.averageParameter.cumulativeMortalityRate),
        },
        layer: {
          eggProductionRate: formatToInteger(api.layer.averageParameter.eggProductionRate),
          cumulativeMortalityRate:
            formatToInteger(api.layer.averageParameter.cumulativeMortalityRate),
          damagedEggRate: formatToInteger(api.layer.averageParameter.damagedEggRate),
        },
      };

      set({
        data: newData,
        formData: newFormData,
        dataLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || "Failed to fetch data",
        dataLoading: false,
      });
    }
  },

  reset: () =>
    set({
      data: initialStatePoultryData,
      formData: initialCalcParamFormData,
    }),

}));

//  .d8888b.  888                           888                      888       .d8888b.  888             888             
// d88P  Y88b 888                           888                      888      d88P  Y88b 888             888             
// Y88b.      888                           888                      888      Y88b.      888             888             
//  "Y888b.   888888  8888b.  88888b.   .d88888  8888b.  888d888 .d88888       "Y888b.   888888  8888b.  888888 .d8888b  
//     "Y88b. 888        "88b 888 "88b d88" 888     "88b 888P"  d88" 888          "Y88b. 888        "88b 888    88K      
//       "888 888    .d888888 888  888 888  888 .d888888 888    888  888            "888 888    .d888888 888    "Y8888b. 
// Y88b  d88P Y88b.  888  888 888  888 Y88b 888 888  888 888    Y88b 888      Y88b  d88P Y88b.  888  888 Y88b.       X88 
//  "Y8888P"   "Y888 "Y888888 888  888  "Y88888 "Y888888 888     "Y88888       "Y8888P"   "Y888 "Y888888  "Y888  88888P' 

// ---- Store type ----
// type PoultryStore = {
//   data: StandardPoultryData;
//   formData: CalcParamFormDataType;
//   setData: (newData: StandardPoultryData) => void,

//   dataLoading: boolean;
//   error: string | null;

//   fetchAverageStats: () => Promise<void>;
//   reset: () => void;
// };
export const formatToInteger = (value: string): number => {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : Math.trunc(num);
};
// ---- Store ----
// export const usePoultryStore = create<PoultryStore>((set) => ({
//   data: initialStatePoultryData,
//   formData: initialCalcParamFormData,
//   setData: (newData: StandardPoultryData) => {
//     set({ data: newData });
//   },
//   dataLoading: false,
//   error: null,


//   fetchAverageStats: async () => {
//     try {
//       set({ dataLoading: true, error: null });

//       const api = await getAverageStandard();

//       // ---- Normalize once ----
//       const newData: StandardPoultryData = {
//         grandParent: {
//           ...initialStatePoultryData.grandParent,
//           averageParameter: api.grandParent.averageParameter,
//         },
//         parent: {
//           ...initialStatePoultryData.parent,
//           averageParameter: api.parent.averageParameter,
//         },
//         layer: {
//           ...initialStatePoultryData.layer,
//           averageParameter: api.layer.averageParameter,
//         },
//         broiler: {
//           ...initialStatePoultryData.broiler,
//           averageParameter: api.broiler.averageParameter,
//         },
//       };

//       // ---- Build formData from same source (not duplicated logic) ----
//       const newFormData: CalcParamFormDataType = {
//         grandparent: {
//           averageHatchableEggRate:
//             formatToInteger(api.grandParent.averageParameter.averageHatchableEggRate),
//           averageCumulativeMortalityRate:
//             formatToInteger(api.grandParent.averageParameter.cumulativeMortalityRate),
//           averageHatchingEggRate:
//             formatToInteger(api.grandParent.averageParameter.averageHatchingEggRate),
//         },
//         parent: {
//           averageHatchableEggRate:
//             formatToInteger(api.parent.averageParameter.averageHatchableEggRate),
//           averageCumulativeMortalityRate:
//             formatToInteger(api.parent.averageParameter.cumulativeMortalityRate),
//           averageHatchingEggRate:
//             formatToInteger(api.parent.averageParameter.averageHatchingEggRate),
//         },
//         broiler: {
//           weight: formatToInteger(api.broiler.averageParameter.weight),
//           cumulativeMortalityRate:
//             formatToInteger(api.broiler.averageParameter.cumulativeMortalityRate),
//         },
//         layer: {
//           eggProductionRate: formatToInteger(api.layer.averageParameter.eggProductionRate),
//           cumulativeMortalityRate:
//             formatToInteger(api.layer.averageParameter.cumulativeMortalityRate),
//           damagedEggRate: formatToInteger(api.layer.averageParameter.damagedEggRate),
//         },
//       };

//       set({
//         data: newData,
//         formData: newFormData,
//         dataLoading: false,
//       });
//     } catch (err: any) {
//       set({
//         error: err?.message || "Failed to fetch data",
//         dataLoading: false,
//       });
//     }
//   },

//   reset: () =>
//     set({
//       data: initialStatePoultryData,
//       formData: initialCalcParamFormData,
//     }),
// }));
