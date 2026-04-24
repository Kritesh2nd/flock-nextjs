export type CalcFormData = {
  startDate: string | null;
  endDate: string | null;
  breedIds: number[];
  hatcheryId: number;
  simulation: StandardPoultryData | null;
};

export type TotalItem = {
  productionType: string;
  total: string;
};

export type DataPoint = {
  purpose: string;
  date: string;
  count: string;
};
export type ProductionDataMap = {
  totals: TotalItem[];
  data: {
    // meat
    BGP_MEAT: DataPoint[];
    BP_MEAT: DataPoint[];
    B_MEAT: DataPoint[];
    LP_MEAT: DataPoint[];
    L_MEAT: DataPoint[];
    // chick
    BP_CHICK: DataPoint[];
    B_CHICK: DataPoint[];
    L_CHICK: DataPoint[];
    // egg
    L_EGG: DataPoint[];
  };
};

// ==============================================================================================

export type SimulationGrandParent = {
  averageHatchableEggRate: number;
  averageCumulativeMortalityRate: number;
  averageHatchingEggRate: number;
};

export type SimulationParent = {
  averageHatchableEggRate: number;
  averageCumulativeMortalityRate: number;
  averageHatchingEggRate: number;
};

export type SimulationLayer = {
  eggProductionRate: number;
  cumulativeMortalityRate: number;
  damagedEggRate: number;
};

export type SimulationBroiler = {
  weight: number;
  cumulativeMortalityRate: number;
};

// Wrapper (this part was fine)
type ParameterSet<T> = {
  averageParameter: T;
  adjustedParameter: T;
};

// Final structure
export type StandardPoultryData = {
  grandParent: ParameterSet<SimulationGrandParent>;
  parent: ParameterSet<SimulationParent>;
  layer: ParameterSet<SimulationLayer>;
  broiler: ParameterSet<SimulationBroiler>;
};

export type CalcParamFormDataType = {
  grandparent: {
    averageHatchableEggRate: number;
    averageCumulativeMortalityRate: number;
    averageHatchingEggRate: number;
  };
  parent: {
    averageHatchableEggRate: number;
    averageCumulativeMortalityRate: number;
    averageHatchingEggRate: number;
  };
  broiler: {
    weight: number;
    cumulativeMortalityRate: number;
  };
  layer: {
    eggProductionRate: number;
    cumulativeMortalityRate: number;
    damagedEggRate: number;
  };
};

// --------------------------------------------------------------------------------------------

export const initialStatePoultryData: StandardPoultryData = {
  grandParent: {
    averageParameter: {
      averageHatchableEggRate: 0,
      averageHatchingEggRate: 0,
      averageCumulativeMortalityRate: 0,
    },
    adjustedParameter: {
      averageHatchableEggRate: 0,
      averageHatchingEggRate: 0,
      averageCumulativeMortalityRate: 0,
    },
  },
  parent: {
    averageParameter: {
      averageHatchableEggRate: 0,
      averageHatchingEggRate: 0,
      averageCumulativeMortalityRate: 0,
    },
    adjustedParameter: {
      averageHatchableEggRate: 0,
      averageHatchingEggRate: 0,
      averageCumulativeMortalityRate: 0,
    },
  },
  layer: {
    averageParameter: {
      eggProductionRate: 0,
      damagedEggRate: 0,
      cumulativeMortalityRate: 0,
    },
    adjustedParameter: {
      eggProductionRate: 0,
      damagedEggRate: 0,
      cumulativeMortalityRate: 0,
    },
  },
  broiler: {
    averageParameter: {
      weight: 0,
      cumulativeMortalityRate: 0,
    },
    adjustedParameter: {
      weight: 0,
      cumulativeMortalityRate: 0,
    },
  },
};

export const initialCalcParamFormData: CalcParamFormDataType = {
  grandparent: {
    averageHatchableEggRate: 50,
    averageCumulativeMortalityRate: 55,
    averageHatchingEggRate: 65,
  },
  parent: {
    averageHatchableEggRate: 10,
    averageCumulativeMortalityRate: 20,
    averageHatchingEggRate: 30,
  },
  broiler: {
    weight: 2340,
    cumulativeMortalityRate: 14,
  },
  layer: {
    eggProductionRate: 1,
    cumulativeMortalityRate: 2,
    damagedEggRate: 3,
  },
};

// =============================================================================================