"use client";
import AllArticles from "@/components/Article/AllArticles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const News = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col w-3xs relative">
          {/* Search input */}
          <div className="relative w-full text-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search Article"
              className="w-full border border-border rounded-md px-8 py-2 capitalize"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          className="add-btn"
          onClick={() => router.push("/dashboard/articles/addArticles")}
        >
          <FaPlus />
          New Article
        </button>
      </div>

      {/* {isSelected === "All Articles" &&
       } */}
      <AllArticles search={search} />
    </div>
  );
};

export default News;
