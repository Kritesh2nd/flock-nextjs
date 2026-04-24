"use client";
import InputCard from "@/components/common/InputField";
import SelectCard from "@/components/common/SelectCard";
import { Purpose } from "@/constants";
import { useAuthStore } from "@/store/authstore";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegChartBar, FaSearch } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { LuBird } from "react-icons/lu";
import { MdOutlineEgg } from "react-icons/md";
import { PiDna } from "react-icons/pi";
import { TbMeat } from "react-icons/tb";
import { deleteBreed, getBreedPrice, postBreed, updateBreed } from "./action";
import { BreedTypeProp } from "@/types";
import toast from "react-hot-toast";
import NoDataCard from "@/components/common/NoData";
import { useRouter } from "next/navigation";
import { useBreedStore } from "@/store/breedStandardStore";
import { BreedSkeleton } from "./loader";
import axiosInstance from "@/lib/axios.utils";

const Breed = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const [addBreed, setAddBreed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    generation: "",
    finalWeight: "",
  });
  const [selectedBreed, setSelectedBreed] = useState("All");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBreed, setEditingBreed] = useState<BreedTypeProp | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { loadBreed, isFetchingBreed, fetchBreed } = useBreedStore();
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceData, setPriceData] = useState({
    priceOfGrandparent: "",
    priceOfParent: "",
  });

  const fetchBreedPrice = async () => {
    try {
      const prices = await getBreedPrice();

      const priceObj: { priceOfGrandparent: string; priceOfParent: string } = {
        priceOfGrandparent: "",
        priceOfParent: "",
      };

      prices.forEach((item: any) => {
        if (item.generation === "GRANDPARENT") {
          priceObj.priceOfGrandparent = item.pricePerBird.toString();
        } else if (item.generation === "PARENT") {
          priceObj.priceOfParent = item.pricePerBird.toString();
        }
      });

      setPriceData(priceObj);
    } catch (err) {
      console.error("Failed to fetch breed price:", err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Breed name is required.";
    }
    if (!formData.generation.trim()) {
      newErrors.generation = "Generation selection is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && editingBreed) {
        const payload = {
          name: formData.name,
          finalWeight: Number(formData.finalWeight),
        };
        const res = await updateBreed(editingBreed.id, payload);
        toast.success("Breed updated successfully.");
        setAddBreed(false);
        await fetchBreed();
      } else {
        const payload = {
          ...formData,
          finalWeight: Number(formData.finalWeight),
        };
        const res = await postBreed(payload);
        toast.success("Breed successfully added.");
        setAddBreed(false);
        await fetchBreed();
      }

      setFormData({ name: "", generation: "", finalWeight: "" });
      setIsEditing(false);
      setEditingBreed(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to save breed.");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", generation: "", finalWeight: "" });
    setIsEditing(false);
    setEditingBreed(null);
    setAddBreed(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setPriceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBreed(id);

      // setLoadBreed((prev) => prev.filter((b) => b.id !== id));
      await fetchBreed();

      toast.success("Breed deleted successfully.");
      setIsOpen(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete breed.");
    }
  };

  const filterData = loadBreed.filter((item) => {
    const matchesPurpose =
      selectedBreed === "All" || item.generation === selectedBreed;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesPurpose && matchesSearch;
  });

  const handleSavePrice = async () => {
    try {
      const params = new URLSearchParams({
        PARENT: priceData.priceOfParent,
        GRANDPARENT: priceData.priceOfGrandparent,
      });

      await axiosInstance.patch(
        `/price-config/update-all?${params.toString()}`,
      );

      toast.success("Prices updated successfully");
      setEditingPrice(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update prices");
    }
  };

  useEffect(() => {
    fetchBreedPrice();
  }, []);

  return (
    <section className="flex flex-1 gap-6 w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex w-full justify-between">
          <div className="flex flex-col w-3xs relative">
            {/* Search input */}
            <div className="relative w-full text-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search Breeds..."
                className="w-full border border-border rounded-md px-8 py-2 capitalize"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
          </div>
          <button
            className="add-btn"
            onClick={() => {
              setIsEditing(false);
              setEditingBreed(null);
              setFormData({ name: "", generation: "", finalWeight: "" });
              setAddBreed(true);
            }}
          >
            <FaPlus />
            <span>Add Breed</span>
          </button>
        </div>
        <ul className="flex gap-1 items-center">
          {["All", "GRANDPARENT", "PARENT", "LAYER", "BROILER"].map(
            (breed, i) => {
              const count =
                breed === "All"
                  ? loadBreed.length
                  : loadBreed.filter((b) => b.generation === breed).length;

              return (
                <li
                  key={i}
                  className={`flex items-center gap-2 text-base rounded-lg px-4 py-2 cursor-pointer transition ${
                    selectedBreed === breed ? "bg-[#D9D9D966]" : ""
                  }`}
                  onClick={() => setSelectedBreed(breed)}
                >
                  <span>{breed}</span>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </li>
              );
            },
          )}
        </ul>

        {addBreed && (
          <div className="fixed inset-0 bg-black/60 h-full w-full z-20">
            <div className="flex items-center justify-center h-full w-full">
              <div className="w-md bg-white px-4 py-5 rounded-lg flex flex-col gap-2 cursor-pointer">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5 items-center modal-title">
                      <PiDna className="rotate-45" />
                      <h1>
                        {isEditing ? "Update Breed info" : "Add New Breed"}
                      </h1>
                    </div>
                    <span className="modal-des">
                      {isEditing
                        ? "Update the saved breeds info"
                        : "Register a new breed in the system"}
                    </span>
                  </div>
                  <IoMdClose size={20} onClick={() => setAddBreed(false)} />
                </div>
                <hr className="border border-border" />
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <InputCard
                    name="name"
                    title="Breed Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter breed name"
                    error={errors.name}
                  />
                  {!isEditing && (
                    <SelectCard
                      value={formData.generation}
                      name="generation"
                      title="Generation"
                      onChange={handleInputChange}
                      options={Purpose}
                    />
                  )}
                  <InputCard
                    name="finalWeight"
                    title="Final Weight"
                    type="number"
                    value={formData.finalWeight}
                    onChange={handleInputChange}
                    placeholder="Enter weight"
                    error={errors.finalWeight}
                  />
                  <span className="text-[10px] text-primary">
                    Note: Final weight is only required for PARENT, GRANDPARENT
                    and LAYERS (in gm)
                  </span>
                  <div className="flex items-end justify-end gap-2">
                    <button
                      onClick={handleCancel}
                      className="form-button-cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="form-button-save">
                      {isEditing ? "Update Breed" : "Save Breed"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {isFetchingBreed ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <BreedSkeleton key={i} />
            ))}
          </ul>
        ) : (
          <>
            {filterData.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 max-h-137 overflow-y-auto px-4">
                <>
                  {filterData &&
                    filterData.map((filter) => (
                      <li
                        key={filter.id}
                        className="border border-border rounded-lg px-3 py-2 flex flex-col gap-2 cursor-pointer"
                      >
                        <div className="flex justify-between">
                          <div className="border border-border text-2xl p-2 flex items-center rounded-lg">
                            {filter.generation === "LAYER" && <MdOutlineEgg />}
                            {filter.generation === "BROILER" && <TbMeat />}
                            {(filter.generation === "PARENT" ||
                              filter.generation === "GRANDPARENT") && (
                              <LuBird />
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 items-end justify-end">
                            {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                              <div className="relative">
                                <HiOutlineDotsVertical
                                  onClick={(e) => {
                                    setIsOpen(
                                      isOpen === filter.id ? null : filter.id,
                                    );
                                  }}
                                />
                                {isOpen === filter.id && (
                                  <div
                                    className="absolute right-1 top-4 bg-white text-black border border-border z-10 rounded-md shadow-lg"
                                    onMouseLeave={() => setIsOpen(null)}
                                  >
                                    <button
                                      className="hover:bg-gray-200 w-full px-1 py-1 text-xs cursor-pointer"
                                      onClick={() => {
                                        setIsEditing(true);
                                        setEditingBreed(filter);
                                        setFormData({
                                          name: filter.name,
                                          generation: filter.generation,
                                          finalWeight:
                                            filter.finalWeight?.toString() ??
                                            "",
                                        });
                                        setAddBreed(true);
                                        setIsOpen(null);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="hover:bg-gray-200 w-full px-1 text-xs py-1 cursor-pointer"
                                      onClick={() => handleDelete(filter.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            <span className="text-[8px] border border-border rounded-md py-0.5 px-1 bg-[#EAEAEA]">
                              {filter.generation}
                            </span>
                          </div>
                        </div>
                        <p className="text-2xl text-center w-full py-2 font-medium">
                          {filter.name}
                        </p>
                        <hr className="border border-border" />
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/breed-standards/${filter.id}`,
                            )
                          }
                          className="flex gap-1.5 items-center justify-center w-full border border-border rounded-lg py-2 px-3 bg-[#F8F8F8] hover:bg-gray-200 cursor-pointer"
                        >
                          <FaRegChartBar />
                          View Standards
                        </button>
                      </li>
                    ))}
                </>
              </ul>
            ) : (
              <NoDataCard message="No breed found" />
            )}
          </>
        )}
      </div>

      <div className="w-full mt-28 flex flex-col gap-2 max-w-85">
        <h1 className="text-lg font-medium">Levy Pricing</h1>
        <div className="flex flex-col gap-4 border border-border rounded-md px-4 py-4">
          <InputCard
            name="priceOfGrandparent"
            title="Grand Parent"
            type="number"
            value={priceData.priceOfGrandparent}
            onChange={handlePriceChange}
            placeholder="Enter price"
            error={errors.priceOfGrandparent}
            disabled={!editingPrice}
          />
          <InputCard
            name="priceOfParent"
            title="Parent"
            type="number"
            value={priceData.priceOfParent}
            onChange={handlePriceChange}
            placeholder="Enter price"
            error={errors.priceOfParent}
            disabled={!editingPrice}
          />
          <div>
            {editingPrice ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePrice}
                  className="bg-primary text-white px-2 py-1 rounded-lg text-sm cursor-pointer tracking-wide"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPrice(false);
                  }}
                  className="border border-primary rounded-lg px-2 py-1 text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingPrice(true)}
                className="bg-primary text-white px-2 py-1 rounded-lg text-sm cursor-pointer"
              >
                Edit Price
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breed;
