import React from "react";

const MoreNewsLoader = () => {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="hidden md:flex md:flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex md:flex-col gap-3 border border-border h-50 md:h-55 p-2 rounded-lg"
          >
            <div className="w-full h-20 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoreNewsLoader;
