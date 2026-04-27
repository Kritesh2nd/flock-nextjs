"use client";

import { worksData } from "@/constants";
import Image from "next/image";

const WorksSection = () => {
  return (
    <section className="globalContainer flex flex-col gap-6 py-6 md:py-12">
      <div className="space-y-3 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold text-left">
          Our Works & Activities
        </h1>
        <p className="text-base md:text-xl text-secondary">
          NHIA actively works to strengthen Nepal's hatchery industry through
          strategic initiatives, crisis management, knowledge sharing, and
          financial advocacy.
        </p>
      </div>
      <div className="space-y-10 md:space-y-16 py-10 md:py-20 px-4 md:px-28">
        {worksData.map((item, index) => {
          const isReverse = index % 2 !== 0;

          return (
            <div
              key={item.id}
              className={`flex flex-col relative items-center ${
                isReverse ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Image */}
              <div className="md:relative w-full md:w-[60%] h-64 md:h-110 rounded-sm overflow-hidden shadow-gray-500 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  height={400}
                  width={400}
                  className="object-cover h-full w-full"
                />
              </div>

              {/* Content Card */}
              <div
                className={`w-full md:absolute md:w-[540px] bg-[#fffafa] shadow-gray-500 md:shadow-sm border border-secondary/30 px-6 py-6 md:py-16 md:px-8 md:rounded-md
                              md:top-1/2 md:-translate-y-1/2 
                              ${isReverse ? "md:-right-10" : "md:-left-10"}`}
              >
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorksSection;
