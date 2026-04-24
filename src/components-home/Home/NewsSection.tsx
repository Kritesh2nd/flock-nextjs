"use client";
import axiosInstance from "@/lib/axios.utils";
import { ArticleHomeProps } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import NewsCard from "../cards/NewsCard";
import { truncateText } from "@/utils/truncateText";
import NoDataCard from "../cards/NoDataCard";
import { getArticleImageUrl } from "@/utils/imageHelper";

const NewsSection = () => {
  const [loadArticles, setLoadArticle] = useState<ArticleHomeProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchArticles = async (page = 1, limit = 4) => {
    try {
      setIsLoading(true);
      const article = await axiosInstance.get(
        `/article/recent?page=${page}&limit=${limit}`,
      );
      const allArticle = article.data.data;
      setLoadArticle(allArticle);
    } catch (err) {
      console.error("Unable to fetch articles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);
  return (
    <section className="py-4 md:py-14 flex flex-col gap-10 globalContainer">
      <div
        className="w-full flex justify-between"
        onClick={() => router.push("/articles")}
      >
        <h1 className="font-bold text-xl md:text-4xl">Latest News & Media</h1>
        <div className="flex items-center gap-1 text-sm md:text-base cursor-pointer font-semibold">
          <span className="underline">See All</span>
          <FaArrowRight />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      ) : (
        <>
          {loadArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* news card */}
              {loadArticles &&
                loadArticles.map((news) => (
                  <NewsCard
                    key={news.id}
                    id={news.id}
                    title={truncateText(news.heading, 50)}
                    des={truncateText(news.subHeading, 100)}
                    img={getArticleImageUrl(news.imageUrl)}
                  />
                ))}
            </div>
          ) : (
            <NoDataCard message="No articles found." className="h-100" />
          )}
        </>
      )}
      {/* news card */}
    </section>
  );
};

export default NewsSection;
