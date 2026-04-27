"use client";

import React, { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import InputCard from "../common/InputField";
import SelectCard from "../common/SelectCard";
import { MdClose } from "react-icons/md";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { LuImagePlus, LuLoaderCircle } from "react-icons/lu";
import Image from "next/image";
import toast from "react-hot-toast";

import { getHatchery, linkHatchery, unlinkHatchery } from "./action";
import { getArticleImageUrl } from "@/utils/imageHelper";
import { UserFormType, UserModalProps, UserPropsType } from "@/types";
import { Hatch, Mod } from "@/constants";
import { BiSave } from "react-icons/bi";
import { useUserStore } from "@/store/userStore";

const UserModal: React.FC<
  UserModalProps & { initialData?: UserPropsType | null }
> = ({
  closeForm,
  onSubmit,
  title,
  des,
  btn1,
  initialData = null,
  roleToShow,
}) => {
  const { addUpdateLoading } = useUserStore();
  const [formData, setFormData] = useState({
    id: initialData?.id,
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role:
      initialData?.roles?.[0] ||
      (roleToShow?.toUpperCase() === "MODERATOR"
        ? "MODERATOR"
        : "HATCHERY_MEMBER"),
    profileUrl: initialData?.profileUrl || "",
    photo: null as File | null,
    isExecutive: initialData?.isExecutive ?? false,
    designation: initialData?.designation ?? "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedHatchery, setSelectedHatchery] = useState<number | null>(
    initialData?.hatchery?.id ?? null,
  );
  const [query, setQuery] = useState("");

  const [hatcheries, setHatcheries] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormType, string>>
  >({});

  useEffect(() => {
    if (roleToShow?.toUpperCase() !== "HATCHERY_MEMBER") return;

    getHatchery()
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data.map((h: any) => ({
              id: h.id,
              name: h.hatcheryName,
            }))
          : [];

        setHatcheries(list);
      })
      .catch(() => {
        toast.error("Failed to load hatcheries");
      });
  }, [roleToShow]);

  const filteredHatcheries =
    query === ""
      ? hatcheries
      : hatcheries.filter((h) =>
          h.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((p) => ({ ...p, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const err: typeof errors = {};
    if (!formData.firstName.trim()) err.firstName = "First Name is required";
    // if (!formData.designation.trim()) err.designation = "Required";
    if (!formData.lastName.trim()) err.lastName = "Last Name is required";
    if (!formData.email.trim()) err.email = "Email is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLinkHatchery = async () => {
    if (!selectedHatchery || !formData.id) return;
    try {
      await linkHatchery(selectedHatchery, Number(formData.id));
      toast.success("Hatchery linked");
    } catch {
      toast.error("Failed to link hatchery");
    }
  };

  const handleUnlinkHatchery = async () => {
    if (!selectedHatchery || !formData.id) return;
    try {
      await unlinkHatchery(selectedHatchery, Number(formData.id));
      setSelectedHatchery(null);
      toast.success("Hatchery unlinked");
    } catch {
      toast.error("Failed to unlink hatchery");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return toast.error("Fix errors");

    const payload: UserFormType = {
      id: formData.id,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roles: [formData.role],
      photo: formData.photo,
      isExecutive: formData.isExecutive,
      hatcheryId: selectedHatchery,
      designation: formData.designation,
    };

    await onSubmit(payload);
    closeForm();
  };
  const isEditing = !!initialData;
  const isModeratorEditing = formData.role === "MODERATOR" && isEditing;
  return (
    <section className="fixed inset-0 bg-black/50 z-30">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white max-w-lg w-full rounded-lg px-5 pt-4 pb-8">
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <h1 className="modal-title">{title}</h1>
              <h2 className="modal-des">{des}</h2>
            </div>
            <MdClose onClick={closeForm} className="cursor-pointer text-base" />
          </div>

          <hr className="my-2 border border-border" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-8">
              {/* Image */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                  {preview || formData.profileUrl ? (
                    <Image
                      src={preview || getArticleImageUrl(formData.profileUrl)}
                      alt="profile"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <FaUser className="w-full h-full text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer text-xs bg-gray-100 px-2 py-1 rounded">
                  {!isModeratorEditing && (
                    <>
                      <LuImagePlus className="inline" /> Upload
                    </>
                  )}
                  <input
                    hidden
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    disabled={isModeratorEditing}
                  />
                </label>
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-3 w-full">
                <InputCard
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  title="First Name"
                  type="text"
                  placeholder="Enter first name"
                  error={errors.firstName}
                  disabled={isModeratorEditing}
                />
                <InputCard
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  title="Last Name"
                  type="text"
                  placeholder="Enter last name"
                  error={errors.lastName}
                  disabled={isModeratorEditing}
                />
                <InputCard
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  title="Email"
                  type="email"
                  placeholder="Enter email"
                  error={errors.email}
                  disabled={isModeratorEditing}
                />
                {roleToShow === "HATCHERY_MEMBER" && (
                  <InputCard
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    title="Designation"
                    type="text"
                    placeholder="Enter your post"
                    error={errors.designation}
                    disabled={isModeratorEditing}
                  />
                )}

                <SelectCard
                  title="Role"
                  value={formData.role}
                  options={
                    roleToShow?.toUpperCase() === "MODERATOR" ? Mod : Hatch
                  }
                  onChange={handleInputChange}
                  name="role"
                  disabled={isModeratorEditing}
                />

                {/* Searchable Hatchery */}
                {roleToShow?.toUpperCase() === "HATCHERY_MEMBER" &&
                  formData.id && (
                    <div className="w-full">
                      <label className="text-primary text-base">
                        Link Hatchery
                      </label>

                      <Combobox
                        value={selectedHatchery}
                        onChange={(value: number | null) =>
                          setSelectedHatchery(value)
                        }
                      >
                        <div className="relative mt-2">
                          <Combobox.Input
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                            displayValue={(id: number) =>
                              hatcheries.find((h) => h.id === id)?.name || ""
                            }
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search Hatchery..."
                          />

                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <FaChevronDown className="text-primary" />
                          </Combobox.Button>

                          {filteredHatcheries.length > 0 && (
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg border border-gray-200 text-sm">
                              {filteredHatcheries.map((h) => (
                                <Combobox.Option
                                  key={h.id}
                                  value={h.id}
                                  className={({ active }) =>
                                    `cursor-pointer select-none px-4 py-2 ${
                                      active ? "bg-blue-100" : ""
                                    }`
                                  }
                                >
                                  {h.name}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>

                      {selectedHatchery ? (
                        <button
                          type="button"
                          onClick={handleUnlinkHatchery}
                          className="text-blue-500 text-sm mt-2"
                        >
                          🔗 Unlink hatchery
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLinkHatchery}
                          className="text-green-600 text-sm mt-2"
                        >
                          ➕ Link hatchery
                        </button>
                      )}
                    </div>
                  )}
                {roleToShow === "HATCHERY_MEMBER" && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      checked={formData.isExecutive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isExecutive: e.target.checked,
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      Executive Member
                    </span>
                  </div>
                )}
              </div>
            </div>

            {!isModeratorEditing && (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="form-button-cancel px-5"
                >
                  Cancel
                </button>
                <button className="form-button-save px-5 flex items-center gap-2">
                  {addUpdateLoading ? (
                    <div className="animate-spin">
                      <LuLoaderCircle />
                    </div>
                  ) : (
                    <BiSave />
                  )}
                  {btn1}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserModal;
