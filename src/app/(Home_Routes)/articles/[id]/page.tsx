"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios.utils";
import { ArticleHomeProps } from "@/types";
import { getArticleImageUrl } from "@/utils/imageHelper";
import MoreNewsCard from "@/components-home/cards/MoreNewsCard";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import ArticleLoader from "@/components-home/loader/ArticleByIdLoader";
import NoDataCard from "@/components-home/cards/NoDataCard";

const ArticleById = () => {
  const { id } = useParams();
  const articleId = Number(id);
  const [loadArticles, setLoadArticle] = useState<ArticleHomeProps[]>([]);
  const [article, setArticle] = useState<ArticleHomeProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axiosInstance.get(
          `/article/complete/by-id/${articleId}`,
        );
        setArticle(res.data);
      } catch (err) {
        console.error("Unable to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const fetchArticles = async (page = 1, limit = 6) => {
    try {
      setLoading(true);
      const article = await axiosInstance.get(
        `/article/recent?page=${page}&limit=${limit}`,
      );
      const allArticle = article.data.data;
      setLoadArticle(allArticle);
    } catch (err) {
      console.error("Unable to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return <ArticleLoader />;
  if (!article)
    return <NoDataCard className="h-140" message="No article found." />;

  const blocks = article.articleContent
    ?.slice()
    .sort((a, b) => a.order - b.order);

  return (
    <div className="globalContainer py-4 md:py-10 flex flex-col md:flex-row gap-4 md:gap-16 w-full">
      <section className="flex flex-col gap-2 md:gap-8 w-full md:w-[80%]">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-4xl font-bold w-full md:w-2xl mb-4">
            {capitalizeFirstLetter(article.heading)}
          </h1>

          <p className="text-gray-700 text-base text-justify mb-4">
            {capitalizeFirstLetter(article.subHeading)}
          </p>

          <Image
            src={getArticleImageUrl(article.imageUrl)}
            alt={article.heading}
            height={1000}
            width={1000}
            className="w-full h-100 object-cover rounded-sm mb-2"
          />
          <span className="text-base text-secondary">
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </span>
        </div>

        <div className="space-y-4 text-gray-800">
          {blocks?.map((block) => {
            switch (block.contentType) {
              case "H1":
                return (
                  <h1 key={block.id} className="text-[32px] font-bold">
                    {capitalizeFirstLetter(block.content)}
                  </h1>
                );

              case "H2":
                return (
                  <h2 key={block.id} className="text-2xl font-semibold">
                    {capitalizeFirstLetter(block.content)}
                  </h2>
                );

              case "H3":
                return (
                  <h3 key={block.id} className="text-lg font-semibold">
                    {capitalizeFirstLetter(block.content)}
                  </h3>
                );
              case "H4":
                return (
                  <h3 key={block.id} className="text-base font-semibold">
                    {capitalizeFirstLetter(block.content)}
                  </h3>
                );
              case "H5":
                return (
                  <h3 key={block.id} className="text-sm font-semibold">
                    {capitalizeFirstLetter(block.content)}
                  </h3>
                );
              case "H6":
                return (
                  <h3 key={block.id} className="text-xs font-semibold">
                    {capitalizeFirstLetter(block.content)}
                  </h3>
                );

              case "PARAGRAPH":
                return (
                  <p key={block.id} className="leading-7 text-base">
                    {capitalizeFirstLetter(block.content)}
                  </p>
                );

              case "URL":
                return (
                  <Image
                    key={block.id}
                    src={getArticleImageUrl(block.content)}
                    alt={block.content}
                    height={1000}
                    width={1000}
                    className="w-full h-100 object-cover rounded-sm border border-border"
                    unoptimized
                  />
                );

              case "LIST": {
                const items =
                  typeof block.content === "string"
                    ? block.content.split("\n").filter(Boolean)
                    : [];

                return (
                  <ul key={block.id} className="list-disc ml-6 space-y-1">
                    {items.map((item, index) => (
                      <li key={index} className="text-base">
                        {capitalizeFirstLetter(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              default:
                return null;
            }
          })}
        </div>
      </section>
      <section className="flex flex-col gap-3 md:w-[25%]">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-3xl font-bold">Latest News</h1>

          <div className="flex md:flex-col gap-3 md:h-screen overflow-x-auto snap-x snap-mandatory">
            {loadArticles &&
              loadArticles.map((news) => (
                <div key={news.id} className="min-w-full snap-start p-2 md:p-0">
                  <MoreNewsCard
                    id={news.id}
                    title={truncateText(news.heading, 40)}
                    des={truncateText(news.subHeading, 80)}
                    img={getArticleImageUrl(news.imageUrl)}
                  />
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleById;
