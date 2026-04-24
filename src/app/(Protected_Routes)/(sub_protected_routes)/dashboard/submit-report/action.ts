import axiosInstance from "@/lib/axios.utils";

export const postReport = async (formData: any) => {
  const res = await axiosInstance.post("/feedbacks", formData);
  return res.data;
};
