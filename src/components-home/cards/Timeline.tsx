import { TimelineData } from "@/constants";

const Timeline = () => {
  return (
    <section className="relative py-10">
      <div className="flex flex-col gap-6 md:gap-14 relative">
        {TimelineData.map((item, index) => {
          const isLast = index === TimelineData.length - 1;

          return (
            <div
              key={index}
              className={`relative flex w-full ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              {!isLast && (
                <>
                  <span className="absolute h-22  md:left-1/2 top-4 md:mt-0 md:bottom-10 md:h-18 w-0.5 bg-gray-300 -translate-x-1/2" />
                  <span className="absolute h-24 bottom-[-28] md:left-1/2 md:top-8 md:h-42 w-0.5 bg-gray-300 -translate-x-1/2" />
                </>
              )}

              {/* Dot */}
              <span className="absolute md:left-1/2 top-1 h-5.5 w-5.5 rounded-full bg-gray-400 -translate-x-1/2" />

              {/* Content */}
              <div
                className={`
                  w-full md:w-[45%]
                  pl-8 md:pl-0
                  ${
                    index % 2 === 0
                      ? "md:pr-10 md:text-right"
                      : "md:pl-10 md:text-left"
                  }
                `}
              >
                <h3 className="font-bold text-primary text-base md:text-2xl">
                  {item.year}
                </h3>

                {item.title && (
                  <h4 className="font-medium text-base md:text-lg mt-1">
                    {item.title}
                  </h4>
                )}

                <p className="text-sm text-primary/50 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Timeline;
