import axiosInstance from "@/lib/axios.utils";
import { BreedTypeProp } from "@/types";

export const getAllBreed = async () => {
  const res = await axiosInstance.get("/breed/find-all");
  return res.data;
};

export const getBreedPrice = async () => {
  const res = await axiosInstance.get("/price-config");
  return res.data;
};

export const postBreed = async (formData: Omit<BreedTypeProp, "id">) => {
  const res = await axiosInstance.post("/breed/create", formData);
  return res.data;
};

export const updateBreed = async (
  id: string,
  formData: Omit<BreedTypeProp, "id" | "generation">,
) => {
  const res = await axiosInstance.patch(`/breed/update/${id}`, formData);
  return res.data;
};

export const deleteBreed = async (id: string) => {
  const res = await axiosInstance.delete(`/breed/delete/${id}`);
  return res.data;
};
