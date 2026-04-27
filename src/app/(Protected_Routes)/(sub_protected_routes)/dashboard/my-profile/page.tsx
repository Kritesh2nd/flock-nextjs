"use client";
import InputCard from "@/components/common/InputField";
import SelectCard from "@/components/common/SelectCard";
import { Gender } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiLock } from "react-icons/ci";
import { FaChevronRight, FaUser } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineShield } from "react-icons/md";
import { fetchSelf, updateProfile } from "./action";
import { useSession } from "next-auth/react";
import { getArticleImageUrl } from "@/utils/imageHelper";
import ProfileLoader from "@/components/loader/ProfileLoader";
import toast from "react-hot-toast";

type myProfileProps = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  createdAt: string;
  role: string;
  photo: File | null;
  profileUrl?: string;
  dob: string;
  gender?: string;
  address?: string;
};
const MyProfile = () => {
  const [formData, setFormData] = useState<myProfileProps>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    createdAt: "",
    role: "",
    photo: null,
    profileUrl: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { update } = useSession();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, photo: file }));

    setPreview(URL.createObjectURL(file));
  };

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      photo: formData.photo,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
    };
    try {
      setLoadingProfile(true);
      const res = await updateProfile(payload);
      const updated = res.data ?? res;

      await update({
        user: {
          firstName: updated.firstName,
          lastName: updated.lastName,
          profileUrl: updated.profileUrl,
        },
      });

      router.refresh();

      const updatedData = {
        ...updated,
        createdAt: toDateInputValue(res.createdAt),
      };
      setFormData(updatedData);
      setOriginalData(updatedData);
      setIsEditing(false);
      if (updated.image) setPreview(updated.image);
      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const toDateInputValue = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetchSelf();

        const formattedData = {
          firstName: res.firstName ?? "",
          lastName: res.lastName ?? "",
          phone: res.phone ?? "",
          email: res.email ?? "",
          role: res.role ?? "",
          photo: null,
          profileUrl: res.profileUrl ?? "",
          dob: res.dob ? toDateInputValue(res.dob) : "",
          gender: res.gender ?? "",
          address: res.address ?? "",
          createdAt: res.createdAt ? toDateInputValue(res.createdAt) : "",
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      {loadingProfile ? (
        <ProfileLoader />
      ) : (
        <main className="flex flex-col gap-2">
          <h1 className="text-lg tracking-wide font-semibold text-primary">
            Basic Information
          </h1>
          <section className="border border-border rounded-lg px-3 py-2">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-primary text-base font-medium">
                  Profile Information
                </h2>
                <span className="text-secondary text-sm">
                  Manage your personal information and settings
                </span>
              </div>
              {!isEditing ? (
                <div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white bg-primary rounded-md px-2 py-1 text-sm cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div>
                    <button
                      className="border border-primary rounded-md px-2 py-1 text-sm cursor-pointer"
                      onClick={() => {
                        setFormData(originalData);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      type="submit"
                      form="profileForm"
                      className="bg-primary text-white px-2 py-1 rounded-md text-sm cursor-pointer"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              )}
            </div>
            <form
              id="profileForm"
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 py-5"
            >
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-2 px-3">
                  <p className="text-base font-medium">Upload Image</p>
                  <div className="w-28 h-28 rounded-full bg-gray-200 flex items-end justify-center overflow-hidden">
                    {preview || formData.profileUrl ? (
                      <Image
                        src={
                          preview ?? getArticleImageUrl(formData.profileUrl!)
                        }
                        alt="Profile Preview"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/icons/profile-picture.png"
                        alt="Dummy-Image"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  {isEditing && (
                    <label className="cursor-pointer bg-gray-100 px-1 py-1.5 font-medium rounded-md text-[10px] flex items-center gap-1.5">
                      <LuImagePlus />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={!isEditing}
                      />
                    </label>
                  )}
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <InputCard
                    name="firstName"
                    title="First Name"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder=""
                    disabled={!isEditing}
                  />
                  <InputCard
                    name="email"
                    title="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=""
                    disabled={!isEditing}
                  />

                  <div>
                    {isEditing ? (
                      <InputCard
                        name="role"
                        title="User Role"
                        type="text"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder=""
                        disabled={true}
                        className="cursor-not-allowed"
                      />
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-base">User Role</span>

                        <div className="flex gap-1 items-center text-sm py-2">
                          <MdOutlineShield />
                          <span className="text-sm">{formData.role}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <InputCard
                    name="lastName"
                    title="Last Name"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder=""
                    disabled={!isEditing}
                  />
                  <InputCard
                    name="phone"
                    title="Phone Number"
                    type="text"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder=""
                    disabled={!isEditing}
                  />
                  <InputCard
                    name="createdAt"
                    title="Member Since"
                    type="date"
                    value={formData.createdAt}
                    onChange={handleInputChange}
                    placeholder=""
                    disabled={true}
                    className={`${isEditing ? "cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>

              <hr className="border border-border" />
              <h3 className="text-primary text-base font-medium">
                Optional Information
              </h3>
              <div className="flex gap-4">
                <InputCard
                  title="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  placeholder=""
                  disabled={!isEditing}
                />
                <SelectCard
                  name="gender"
                  value={formData.gender!}
                  title="Gender"
                  onChange={handleInputChange}
                  options={Gender}
                  disabled={!isEditing}
                />
              </div>
              <div className="w-[50%]">
                <InputCard
                  name="address"
                  title="Address"
                  type="text"
                  value={formData.address!}
                  onChange={handleInputChange}
                  placeholder=""
                  disabled={!isEditing}
                />
              </div>
            </form>
          </section>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg">Security Setting</h1>
            <div
              className="flex items-center cursor-pointer justify-between border border-border rounded-md px-2 py-1"
              onClick={() =>
                router.push("/dashboard/my-profile/change-password")
              }
            >
              <div className="flex items-center justify-between gap-2 py-1">
                <CiLock />
                <span className="text-sm">Change Password</span>
              </div>
              <FaChevronRight size={12} />
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default MyProfile;
