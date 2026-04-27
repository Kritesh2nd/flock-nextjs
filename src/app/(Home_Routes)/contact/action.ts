import axiosInstance from "@/lib/axios.utils";

export const sendContact = async (formData: any) => {
  const res = await axiosInstance.post(`/contact`, formData);
  return res;
};
