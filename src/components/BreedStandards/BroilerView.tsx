import { individualBreedProps } from "@/types";
import React from "react";
import NoDataCard from "../common/NoData";

const BroilerView = ({ breedName, generation, data }: individualBreedProps) => {
  if (!data) return;
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
          <span className="w-full text-base text-center">Day</span>
          <span className="w-full text-base text-center">Weight (g)</span>
          <span className="w-full text-base text-center">
            Cum. Mortality Rate %
          </span>
        </div>
        {data.length > 0 ? (
          <div className="h-110 overflow-y-auto">
            {data.map((broiler) => (
              <div
                key={broiler.id}
                className="flex w-full border border-border py-2.5"
              >
                <span className="w-full text-base text-center font-light">
                  {broiler.day}
                </span>
                <span className="w-full text-base text-center font-light">
                  {broiler.weight}
                </span>
                <span className="w-full text-base text-center font-light">
                  {broiler.cumulativeMortalityRate}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <NoDataCard message={`No ${breedName} data found.`} />
        )}
      </div>
    </div>
  );
};

export default BroilerView;
