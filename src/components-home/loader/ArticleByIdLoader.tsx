const ArticleLoader = () => {
  return (
    <div className="globalContainer py-4 md:py-10 flex flex-col md:flex-row gap-4 md:gap-16 w-full animate-pulse">
      {/* Left Section */}
      <section className="flex flex-col gap-4 w-full md:w-[80%]">
        <div className="h-8 bg-gray-300 rounded w-full md:w-xl"></div>
        <div className="h-4 bg-gray-300 rounded w-full md:w-xl"></div>
        <div className="h-4 bg-gray-300 rounded w-full md:w-sm"></div>

        <div className="space-y-3">
          <div className="h-5 bg-gray-300 rounded w-full"></div>
          <div className="h-5 bg-gray-300 rounded w-11/12"></div>
          <div className="h-5 bg-gray-300 rounded w-10/12"></div>
          <div className="h-5 bg-gray-300 rounded w-9/12"></div>
        </div>

        <div className="w-full h-80 bg-gray-300 rounded-sm"></div>
      </section>

      <section className="flex flex-col gap-4 md:w-[25%]">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>

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
    </div>
  );
};

export default ArticleLoader;
