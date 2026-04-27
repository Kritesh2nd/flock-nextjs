import React from "react";

const ProfileLoader = () => {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="h-5 w-42 rounded-md bg-gray-200" />
      <section className="rounded-lg border border-border px-3 py-2">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-42 rounded-md bg-gray-200" />
            <div className="h-6 w-60 rounded-md bg-gray-200" />
          </div>
          <div className="h-9 w-30 rounded-md bg-gray-200" />
        </div>
        <div className="flex flex-col gap-3 py-5">
          <div className="flex gap-8">
            <div className="flex flex-col gap-2 px-3">
              <div className="h-3 w-14 bg-gray-200 rounded-md" />
              <div className="rounded-full h-30 w-30 bg-gray-100" />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-md h-4 w-20" />
                <div className="bg-gray-200 h-10 rounded-md w-100" />
              </div>
            </div>
          </div>
        </div>
        <hr className="border border-border w-full h-px" />
        <div className="flex flex-col gap-3 w-full py-5">
          <div className="bg-gray-200 h-4 rounded-md w-44" />
          {/* <div className="bg-gray-200 h-11 rounded-md w-100" /> */}
        </div>
      </section>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded-md h-6 w-44" />
        <div className="bg-gray-200 h-10 rounded-md w-full" />
      </div>
    </div>
  );
};

export default ProfileLoader;
