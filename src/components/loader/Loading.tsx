import React from "react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="rounded-full animate-spin h-16 w-16 z-10"></div>
    </div>
  );
};

export const HatcheriesLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="py-4 rounded-md bg-gray-200 w-3xs"></div>
            <div className="py-4 bg-gray-200 rounded-md w-xs"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-44 rounded-md bg-gray-200 h-10"></div>
            <div className="w-44 rounded-md bg-gray-200 h-10"></div>
          </div>
        </div>
        <div className="md:h-[45vh] xl:h-[60vh] rounded-md bg-gray-200 w-full"></div>
      </div>
    </div>
  );
};

export const UserLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 mb-2">
        <div className="w-30 rounded-md bg-gray-200 h-10"></div>
        <div className="w-30 rounded-md bg-gray-200 h-10"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="py-4 rounded-md bg-gray-200 w-3xs"></div>
            <div className="py-4 bg-gray-200 rounded-md w-xs"></div>
          </div>
          <div className="w-44 rounded-md bg-gray-200 h-10"></div>
        </div>
        <div className="md:h-[45vh] xl:h-[60vh] rounded-md bg-gray-200 w-full"></div>
      </div>
    </div>
  );
};
