const LatestNewsLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 border border-border rounded-lg p-3"
        >
          <div className="w-full h-40 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
};

export default LatestNewsLoader;
