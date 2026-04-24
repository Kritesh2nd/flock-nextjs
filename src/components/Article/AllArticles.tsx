"use client";
import { getAllArticles } from "@/app/(Protected_Routes)/(sub_protected_routes)/dashboard/articles/action";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import Pagination from "../common/Pagination";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios.utils";
import toast from "react-hot-toast";
import { getArticleImageUrl } from "@/utils/imageHelper";
import { truncateText } from "@/utils/truncateText";
import NoDataCard from "../common/NoData";
import { TiPin } from "react-icons/ti";

export interface ArticlesProp {
  imageUrl: string;
  id: number;
  heading: string;
  subHeading: string;
  createdAt: string;
  pin: boolean;
}
const AllArticles = ({ search }: { search: string }) => {
  const [articles, setArticles] = useState<ArticlesProp[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(4);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const fetchArticles = async (page = 1, limit = 4) => {
    try {
      setIsLoadingArticles(true);
      const res = await getAllArticles(page, limit);
      // console.log(res, "res1");
      const data = res.data ?? [];
      // console.log(data, "res2");

      const meta = res.metadata ?? {};

      setArticles(data);
      setCurrentPage(meta.currentPage);
      setTotalPages(meta.totalPages);
      setTotalItems(meta.totalItems);
      setCurrentLimit(meta.currentLimit);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.heading.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/article/delete/${id}`);
      setArticles((prev) => prev.filter((article) => article.id !== id));
      toast.success("Successfully deleted!");
    } catch (err) {
      console.error("Unable to delete:", err);
    }
  };

  const handlePin = async (id: number, pinStatus: boolean) => {
    try {
      const res = await axiosInstance.patch(
        `/article/update-pin/${id}?pinStatus=${!pinStatus}`,
        {},
      );
      toast.success("Article successfully pinned.");
      fetchArticles();
    } catch (err) {
      console.error("Unable to pin message.");
    }
  };

  useEffect(() => {
    fetchArticles(currentPage, currentLimit);
  }, [currentPage, currentLimit]);

  const PLACEHOLDER_COUNT = currentLimit;
  const emptySlots = PLACEHOLDER_COUNT - filteredArticles.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoadingArticles)
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: currentLimit }).map((_, index) => (
          <div
            key={index}
            className="flex gap-8 w-full border border-border rounded-md p-3 animate-pulse"
          >
            <div className="h-32 w-48 bg-gray-200 rounded-md"></div>
            <div className="flex flex-col w-full gap-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  return (
    <>
      {filteredArticles.length > 0 ? (
        <div className="flex flex-col">
          <ul className="flex flex-col gap-2">
            {filteredArticles.map((all, i) => (
              <li
                key={all.id}
                className="flex gap-8 w-full border border-border rounded-md p-3"
              >
                <div className="relative">
                  <Image
                    src={
                      all.imageUrl
                        ? getArticleImageUrl(all.imageUrl)
                        : "/icons/placeholder.jpeg"
                    }
                    alt="No Image"
                    height={400}
                    width={400}
                    className="h-30 w-50 object-cover rounded-md "
                    unoptimized
                  />
                  {all.pin === true && (
                    <TiPin className="text-[#c41e3a] text-3xl absolute -top-3 -right-3" />
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-2xl font-medium">
                    {truncateText(all.heading, 50)}
                  </span>
                  <span className="text-base">
                    {truncateText(all.subHeading, 200)}
                  </span>
                  <span>
                    {new Date(all.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="relative" onMouseLeave={() => setIsOpen(null)}>
                  <div className="flex gap-2">
                    <HiDotsVertical
                      className="relative cursor-pointer text-secondary text-xl"
                      onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                        e.stopPropagation();
                        setIsOpen(isOpen === all.id ? null : all.id);
                      }}
                    />
                  </div>
                  {isOpen === all.id && (
                    <div
                      ref={menuRef}
                      className="absolute top-4 right-1 bg-white rounded-md border border-border"
                      onMouseLeave={() => setIsOpen(null)}
                    >
                      <div className="flex flex-col">
                        <button
                          className="text-xs hover:bg-gray-200 transition duration-200 px-3 py-1 cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/articles/${all.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(all.id)}
                          className="text-xs px-3 py-1 hover:bg-gray-200 transition duration-200 cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePin(all.id, all.pin)}
                          className="text-xs px-3 py-1 hover:bg-gray-200 transition duration-200 cursor-pointer"
                        >
                          {all.pin ? "Unpin" : "Pin"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {Array.from({ length: Math.max(0, emptySlots) }).map((_, i) => (
              <li
                key={`placeholder-${i}`}
                className="flex gap-8 w-full border border-border opacity-0 rounded-md p-3 pointer-events-none"
              >
                <div className="h-32 w-48 rounded-md" />
                <div className="flex flex-col w-full gap-3">
                  <div className="h-6 w-3/4" />
                  <div className="h-4 w-full" />
                  <div className="h-4 w-full" />
                  <div className="h-4 w-1/4" />
                </div>
                <div className="h-6 w-6" />
              </li>
            ))}
          </ul>
          {filteredArticles.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={currentLimit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      ) : (
        <NoDataCard message="No articles found" />
      )}
    </>
  );
};

export default AllArticles;
