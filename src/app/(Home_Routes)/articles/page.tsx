"use client";
import MoreNewsCard from "@/components-home/cards/MoreNewsCard";
import NewsCard from "@/components-home/cards/NewsCard";
import LatestNewsLoader from "@/components-home/loader/LatestNewsLoader";
import MoreNewsLoader from "@/components-home/loader/MoreNewsLoader";
import axiosInstance from "@/lib/axios.utils";
import { ArticleHomeProps } from "@/types";
import { getArticleImageUrl } from "@/utils/imageHelper";
import { truncateText } from "@/utils/truncateText";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";

const Articles = () => {
  const [latestArticles, setLatestArticles] = useState<ArticleHomeProps[]>([]);
  const [moreArticles, setMoreArticles] = useState<ArticleHomeProps[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchInitialArticles = async () => {
    try {
      setIsLoadingLatest(true);
      setIsLoadingMore(true);
      const response = await axiosInstance.get(
        `/article/recent?page=1&limit=6`,
      );
      const articles = response.data.data ?? response.data;
      setLatestArticles(articles);
      setMoreArticles(articles);
    } catch (err) {
      console.error("Unable to fetch initial articles:", err);
    } finally {
      setIsLoadingLatest(false);
      setIsLoadingMore(false);
    }
  };

  const fetchLatestArticles = async (query: string) => {
    try {
      setIsLoadingLatest(true);
      const url = `/article/search?query=${encodeURIComponent(query)}&limit=6`;
      const response = await axiosInstance.get(url);
      const articles = response.data.data ?? response.data;
      setLatestArticles(articles);
    } catch (err) {
      console.error("Unable to fetch search articles:", err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.trim()) fetchLatestArticles(value);
      else fetchInitialArticles();
    }, 700); // 700ms debounce
  };

  useEffect(() => {
    fetchInitialArticles();
  }, []);

  return (
    <>
      <div className="globalContainer py-4 md:py-10 flex flex-col md:flex-row gap-4 md:gap-16 w-full">
        <section className="flex flex-col gap-2 md:gap-4 w-full md:w-[80%]">
          <div className="flex flex-col w-3xs relative">
            {/* Search input */}
            <div className="relative w-full text-sm">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search Article"
                className="w-full border border-border rounded-md px-8 py-2 capitalize"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-1">Latest News</h1>
          {isLoadingLatest ? (
            <LatestNewsLoader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* news card */}
              {latestArticles &&
                latestArticles.map((news) => (
                  <NewsCard
                    key={news.id}
                    id={news.id}
                    title={truncateText(news.heading, 50)}
                    des={truncateText(news.subHeading, 100)}
                    img={getArticleImageUrl(news.imageUrl)}
                  />
                ))}
            </div>
          )}
        </section>
        <section className="flex flex-col gap-3 md:w-[25%]">
          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:text-3xl font-bold">More News</h1>
            {isLoadingMore ? (
              <MoreNewsLoader />
            ) : (
              <div className="flex md:flex-col gap-3 md:h-screen overflow-x-auto snap-x snap-mandatory p-1">
                {moreArticles &&
                  moreArticles.map((news) => (
                    <div
                      key={news.id}
                      className="min-w-full snap-start p-2 md:p-0"
                    >
                      <MoreNewsCard
                        key={news.id}
                        id={news.id}
                        title={truncateText(news.heading, 50)}
                        des={truncateText(news.subHeading, 75)}
                        img={getArticleImageUrl(news.imageUrl)}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Articles;
