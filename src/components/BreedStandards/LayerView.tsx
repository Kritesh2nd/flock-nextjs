import { individualBreedProps } from "@/types";
import React from "react";
import NoDataCard from "../common/NoData";

const LayerView = ({ breedName, generation, data }: individualBreedProps) => {
  if (!data) return null;
  return (
    <div className="flex flex-col border border-border rounded-lg py-4">
      <div className="flex flex-col gap-1 px-4 mb-4">
        <span className="text-2xl font-medium">
          {breedName} - {generation} Standards
        </span>
        <span className="text-base font-light">
          Weekly egg production metrics
        </span>
      </div>
      <div className="px-4">
        <div className="flex w-full border border-border font-medium py-2.5 bg-primary/5">
          <span className="w-full text-base text-center">Week</span>
          <span className="w-full text-base text-center">Total Egg Rate %</span>
          <span className="w-full text-base text-center">
            Damage Egg Rate %
          </span>
          <span className="w-full text-base text-center">
            Cum. Mortality Rate %
          </span>
        </div>
        {data.length > 0 ? (
          <div className="h-110 overflow-y-auto">
            {data.map((layer) => (
              <div
                key={layer.id}
                className="flex w-full border border-border py-2.5"
              >
                <span className="w-full text-base text-center font-light">
                  {layer.week}
                </span>
                <span className="w-full text-base text-center font-light">
                  {layer.eggProductionRate}
                </span>
                <span className="w-full text-base text-center font-light">
                  {layer.damagedEggRate}
                </span>
                <span className="w-full text-base text-center font-light">
                  {layer.cumulativeMortalityRate}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <NoDataCard message={`No ${breedName} found.`} />
        )}
      </div>
    </div>
  );
};

export default LayerView;
