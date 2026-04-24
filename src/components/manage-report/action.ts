import axiosInstance from "@/lib/axios.utils";

export const getAllReports = async () => {
  const res = await axiosInstance.get("/feedbacks");
  return res.data;
};

export const deleteReport = async (id: string) => {
  const res = await axiosInstance.delete(`/feedbacks/${id}`);
  return res.data;
};
