import axiosInstance from "@/lib/axios.utils";

export const fetchSelf = async () => {
  const res = await axiosInstance.get("/user/me");
  return res.data;
};
export const updateProfile = async (bodyDto: any) => {
  const formData = new FormData();

  formData.append("firstName", bodyDto.firstName);
  formData.append("lastName", bodyDto.lastName);
  formData.append("email", bodyDto.email);
  formData.append("phone", bodyDto.phone);
  formData.append("dob", bodyDto.dob);
  formData.append("gender", bodyDto.gender);
  formData.append("address", bodyDto.address);

  if (bodyDto.photo) {
    formData.append("photo", bodyDto.photo);
  }
  const res = await axiosInstance.patch("/user/update-self", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const res = await axiosInstance.patch("/user/update-password-self", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
