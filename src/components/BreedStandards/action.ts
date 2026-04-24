import axiosInstance from "@/lib/axios.utils";

export const postParentStandard = async (id: string, formData: any) => {
  const res = await axiosInstance.post(`/breed/create/parent/${id}`, formData);
  return res.data;
};

export const postGrandParentStandard = async (id: string, formData: any) => {
  const res = await axiosInstance.post(
    `/breed/create/grand-parent/${id}`,
    formData,
  );
  return res.data;
};

export const getIndividualBreedData = async (id: string) => {
  const res = await axiosInstance.get(`/breed/find-all/breed-standard/${id}`);
  return res.data;
};

export const postBroilers = async (id: string, formData: any) => {
  const res = await axiosInstance.post(`/breed/create/broiler/${id}`, formData);
  return res.data;
};

export const postLayers = async (id: string, formData: any) => {
  const res = await axiosInstance.post(`/breed/create/layer/${id}`, formData);
  return res.data;
};

export const deleteGrandParent = async (id: number) => {
  const res = await axiosInstance.delete(`/breed/delete/grand-parent/${id}`);
  return res.data;
};

export const deleteParent = async (id: number) => {
  const res = await axiosInstance.delete(`/breed/delete/parent/${id}`);
  return res.data;
};
export const deleteLayers = async (id: number) => {
  const res = await axiosInstance.delete(`/breed/delete/layer/${id}`);
  return res.data;
};
export const deleteBroilers = async (id: number) => {
  const res = await axiosInstance.delete(`/breed/delete/broiler/${id}`);
  return res.data;
};
