import { HatcheryFormType, HatcheryModalProps, OptionValues } from "@/types";
import React, { useEffect, useState } from "react";
import InputCard from "../common/InputField";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";

const HatcheryModal: React.FC<
  HatcheryModalProps & { initialData?: HatcheryFormType | null }
> = ({ closeForm, onSubmit, title, btn, des, initialData = null }) => {
  const { hatcheryMembers, fetchHatcheryMembers } = useUserStore();
  const [formData, setFormData] = useState({
    registrationNumber: initialData?.registrationNumber || "",
    hatcheryName: initialData?.hatcheryName || "",
    address: initialData?.address || "",
    ownerId: initialData?.ownerId || "",
    ownerName: initialData?.ownerName || "",
    contactNumber: initialData?.contactNumber || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof HatcheryFormType, string>>
  >({});

  const [ownerSearch, setOwnerSearch] = useState("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.hatcheryName.trim())
      newErrors.hatcheryName = "Hatchery name is required";
    if (!formData.registrationNumber.trim())
      newErrors.registrationNumber = "Registered number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.ownerName.trim())
      newErrors.ownerName = "Owner Name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchHatcheryMembers();
  }, []);

  const filteredOwners = hatcheryMembers.filter((member) =>
    `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(ownerSearch.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }
    const numericFormData: HatcheryFormType = {
      ...formData,
      ownerId:
        formData.ownerId === "" || formData.ownerId === null
          ? null
          : Number(formData.ownerId),
    };

    onSubmit(numericFormData);
    closeForm();
    setFormData({
      registrationNumber: initialData?.registrationNumber || "",
      hatcheryName: initialData?.hatcheryName || "",
      contactNumber: initialData?.contactNumber || "",
      address: initialData?.address || "",
      ownerId: initialData?.ownerId || "",
      ownerName: initialData?.ownerName || "",
    });
  };

  const handleCancel = () => {
    closeForm();
    setFormData({
      registrationNumber: "",
      hatcheryName: "",
      address: "",
      ownerId: "",
      ownerName: "",
      contactNumber: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="fixed inset-0 bg-black/50 z-30">
      <div className="flex items-center justify-center h-screen ">
        <div className="bg-white max-w-xl w-full rounded-lg px-5 py-4 flex flex-col gap-2 border border-border">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="modal-title">{title}</h1>
              <h2 className="modal-des">{des}</h2>
            </div>
            <MdClose onClick={closeForm} className="cursor-pointer" />
          </div>
          <hr className="h-px w-full border-border border" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <InputCard
                name="hatcheryName"
                value={formData.hatcheryName}
                onChange={handleInputChange}
                title="Hatchery Name"
                type="text"
                placeholder="Enter your hatchery name"
                error={errors.hatcheryName}
              />
              <InputCard
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                title="Registered Number"
                type="text"
                placeholder="Enter your registered Number"
                error={errors.registrationNumber}
              />
            </div>
            <div className="flex gap-4">
              <InputCard
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                title="Address"
                type="text"
                placeholder="Enter your address"
                error={errors.address}
              />
              <InputCard
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                title="Owner Name"
                type="text"
                placeholder="Enter your name"
                error={errors.ownerName}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full flex flex-col gap-1 relative">
                <label className="input-title">Owner</label>
                <input
                  type="text"
                  value={ownerSearch}
                  placeholder="Search owner..."
                  className="bg-white text-primary rounded-md py-2 px-3 text-sm shadow-xs border border-border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 w-full"
                  onFocus={() => setShowOwnerDropdown(true)}
                  onChange={(e) => {
                    setOwnerSearch(e.target.value);
                    setShowOwnerDropdown(true);
                  }}
                />

                {showOwnerDropdown && ownerSearch.trim().length > 0 && (
                  <div className="absolute z-20 bg-white border border-border w-full max-h-40 overflow-y-auto shadow-md top-16">
                    {filteredOwners.length === 0 ? (
                      <div className="p-2 text-sm text-gray-400">
                        No owners found
                      </div>
                    ) : (
                      filteredOwners.map((member) => (
                        <div
                          key={member.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              ownerId: member.id,
                              ownerName: `${member.firstName} ${member.lastName}`,
                            }));
                            setOwnerSearch(
                              `${member.firstName} ${member.lastName}`,
                            );
                            setShowOwnerDropdown(false);
                          }}
                        >
                          {member.firstName} {member.lastName}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {errors.ownerId && (
                  <p className="text-red-500 text-sm">{errors.ownerId}</p>
                )}
              </div>

              <InputCard
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                title="Contact Number"
                type="text"
                placeholder="Enter Contact Number"
                error={errors.contactNumber}
              />
            </div>

            <div className="flex gap-2 items-end justify-end pt-4">
              <button
                type="button"
                className="form-button-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="form-button-save">
                {btn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HatcheryModal;
