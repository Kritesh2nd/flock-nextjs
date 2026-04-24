import axiosInstance from "@/lib/axios.utils";
import { FlockFormType, HatcheryFormType, HatcheryPropsType } from "@/types";

export const getAllHatcheries = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/hatcheries?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getHatcheries = async () => {
  const res = await axiosInstance.get("/hatcheries");
  return res.data;
};
export const addHatchery = async (data: HatcheryFormType) => {
  const res = await axiosInstance.post("/hatcheries", data);
  return res.data;
};

export const getHatcheryById = async (id: number) => {
  const res = await axiosInstance.get(`/hatcheries/${id}`);
  return res.data;
};

export const updateHatchery = async (
  id: string,
  formData: HatcheryPropsType,
) => {
  const res = await axiosInstance.patch(`/hatcheries/${id}`, formData);
  return res.data;
};

export const deleteHatchery = async (id: string) => {
  const res = await axiosInstance.delete(`/hatcheries/${id}`);
  return res.data;
};

export const getAllFlocks = async (id: number, page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/flock/find-all/by-hatchery/${id}?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const addFlockData = async (data: FlockFormType) => {
  const res = await axiosInstance.post("/flock/create", data);
  return res.data;
};

export const deleteFlock = async (id: number) => {
  const res = await axiosInstance.delete(`/flock/delete/${id}`);
  return res.data;
};

export const searchHatchery = async (name: string) => {
  const res = await axiosInstance.get("/hatcheries/search", {
    params: { name },
  });
  return res.data;
};

export const addPayment = async (formData: any) => {
  const res = await axiosInstance.post("/price-config/payment", formData);
  return res.data;
};
