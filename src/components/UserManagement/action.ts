import axiosInstance from "@/lib/axios.utils";
import { UserFormType } from "@/types";

export const postModeratorsOrHatcheryMember = async (bodyDto: UserFormType) => {
  const formData = new FormData();

  formData.append("firstName", bodyDto.firstName);
  formData.append("lastName", bodyDto.lastName);
  formData.append("email", bodyDto.email);
  formData.append("isExecutive", bodyDto.isExecutive ? "true" : "false");
  if (bodyDto.designation) formData.append("designation", bodyDto.designation);
  bodyDto.roles.forEach((role) => {
    formData.append("roles[]", role);
  });

  if (bodyDto.photo) {
    formData.append("photo", bodyDto.photo);
  }

  const res = await axiosInstance.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
};

export const deleteUsers = async (id: string) => {
  const res = await axiosInstance.delete(`/user/soft-delete/${id}`);
  return res.data;
};

export const getAllModerators = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/user/moderators?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getAllHatcheryMember = async (page = 1, limit = 6) => {
  const res = await axiosInstance.get(
    `/user/withHatchery?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const updateHatcheryMembers = async (id: number, formData: any) => {
  const res = await axiosInstance.patch(`/user/updatebyadmin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const addSubscriptionToUser = async (userId: string, data: any) => {
  if (!userId) throw new Error("User ID is required");
  try {
    const res = await axiosInstance.patch(
      `/user/add-subscription/${userId}`,
      data,
    );
    return res;
  } catch (error: any) {
    console.error(
      "Failed to add subscription:",
      error.response || error.message,
    );
    throw error;
  }
};
export const getHatchery = async () => {
  const res = await axiosInstance.get("/hatcheries");
  return res.data; // { data, metadata }
};

export const linkHatchery = async (userId: number, hatcheryId: number) => {
  return axiosInstance.patch(`/hatcheries/link/${userId}`, { hatcheryId });
};

export const unlinkHatchery = async (hatcheryId: number, userId: number) => {
  return axiosInstance.patch(`/hatcheries/unlink/${userId}`, { hatcheryId });
};

export const getUserById = async (id: number) => {
  const res = await axiosInstance.get(`/user/withHatchery`);
  return res.data;
};

export const updateUserBanStatus = async (id: number, isBanned: boolean) => {
  try {
    const res = await axiosInstance.patch(
      `/user/update-ban/${id}?isBanned=${isBanned}`,
    );
    return res.data;
  } catch (error) {
    console.error("Failed to update ban status:", error);
    throw error;
  }
};

export const searchBar = async (name: string) => {
  const res = await axiosInstance.get("/user/search", { params: { name } });
  return res.data;
};

export const searchModerator = async (name: string) => {
  const res = await axiosInstance.get("/user/search/moderator", {
    params: { name },
  });
  return res.data;
};

export const searchHatcheryMember = async (name: string) => {
  const res = await axiosInstance.get("/user/search/hatchery-member", {
    params: { name },
  });
  return res.data;
};

export const findById = async (id: string) => {
  const res = await axiosInstance.get(`/user/find-one/${id}`);
  return res.data;
};
