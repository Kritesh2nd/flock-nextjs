import axiosInstance from "@/lib/axios.utils";

export const getAllFormSubmission = async (page: number, limit: number) => {
  const res = await axiosInstance.get(`/contact?page=${page}&limit=${limit}`);
  return res.data;
};

export const deleteForms = async (id: number) => {
  const res = await axiosInstance.delete(`/contact/${id}`);
  return res.data;
};

export const searchForm = async (q: string) => {
  const res = await axiosInstance.get("/contact/search", { params: { q } });
  return res.data;
};
