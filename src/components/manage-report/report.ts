// services/report.service.ts
import axiosInstance from "@/lib/axios.utils";

export const getAllReport = async () => {
    const res = await axiosInstance.get("/feedbacks");
    return res.data;
};
