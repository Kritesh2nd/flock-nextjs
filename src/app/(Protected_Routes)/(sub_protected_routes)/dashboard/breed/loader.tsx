export const BreedSkeleton = () => {
  return (
    <li className="border border-border rounded-lg px-3 py-2 flex flex-col gap-2 animate-pulse">
      <div className="flex justify-between">
        {/* Icon placeholder */}
        <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>

        {/* Badge placeholder */}
        <div className="flex flex-col gap-1.5 items-end justify-end">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Name placeholder */}
      <div className="h-6 w-full bg-gray-300 rounded my-2"></div>

      <hr className="border border-border" />

      {/* Button placeholder */}
      <div className="h-8 w-full bg-gray-300 rounded mt-2"></div>
    </li>
  );
};
