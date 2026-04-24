import axiosInstance from "@/lib/axios.utils";
import { HatcheryType } from "@/types";
import { CalcFormData, ProductionDataMap } from "@/types/calculation";

export const getHatcheryList = async (): Promise<HatcheryType[]> => {
  const res = await axiosInstance.get(`/hatcheries?page=1&limit=6`);

  return res.data.data as HatcheryType[];
};

export const searchHatcheryList = async (
  searchName: string,
): Promise<HatcheryType[]> => {
  const res = await axiosInstance.get(
    `/hatcheries/search?name=${searchName}&page=1&limit=6`,
  );

  return res.data.data as HatcheryType[];
};

export const getChartData = async ({
  formData,
}: {
  formData: CalcFormData;
}) => {
  const res = await axiosInstance.post(`/calculations/data`, formData);
  return res.data as ProductionDataMap;
};

export const getAverageStandard = async (): Promise<any> => {
  const res = await axiosInstance.get(
    `/calculations/average-standard-statistics`,
  );
  return res.data;
};

export const generateReportFile = async ({
  formData,
}: {
  formData: CalcFormData;
}) => {
  const res = await axiosInstance.post(`/report/generate`, formData, {
    responseType: "blob",
  });
  return res.data;
};
