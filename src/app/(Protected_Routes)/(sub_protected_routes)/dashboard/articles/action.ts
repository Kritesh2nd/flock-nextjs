import axiosInstance from "@/lib/axios.utils";

export const getAllArticles = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/article/recent?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getAllDrafts = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/article/draft?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getArticleById = async (id: number) => {
  const res = await axiosInstance.get(`/article/by-id/${id}`);
  return res.data;
};

export const searchArticlesHome = async (query: string) => {
  const res = await axiosInstance.get("/user/search", { params: { query } });
  return res.data;
};
