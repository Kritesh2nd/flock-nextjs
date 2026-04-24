import axiosInstance from "@/lib/axios.utils";

// Get all deleted hatcheries
export const getDeletedHatcheries = async (page = 1, limit = 6) => {
  const res = await axiosInstance.get("/hatcheries/deleted", {
    params: { page, limit },
  });
  // console.log(res.data)
  return res.data.data; // return only array
};

// Recover a hatchery by ID
export const recoverHatchery = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/hatcheries/recover/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error recovering hatchery:", error);
    throw error;
  }
};

export const getDeletedFlock = async (page = 1, limit = 6) => {
  const res = await axiosInstance.get("/flock/find-all/deleted", {
    params: { page, limit },
  });

  return res.data.data; // return only array
};

// Recover a flock by ID
export const recoverFlock = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/flock/recover/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error recovering hatchery:", error);
    throw error;
  }
};

export const getDeleteUser = async (page = 1, limit = 6) => {
  const res = await axiosInstance.get("/user/soft-deleted", {
    params: { page, limit },
  });
  console.log(res, "users");
  return res.data.data; // return only array
};

export const recoverUser = async (id: number) => {
  try {
    const res = await axiosInstance.patch(`/user/clear-soft-delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error recovering user:", error);
    throw error;
  }
};
