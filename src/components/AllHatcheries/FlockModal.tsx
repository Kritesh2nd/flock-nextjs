import React, { useEffect, useState } from "react";
import InputCard from "../common/InputField";
import { MdClose } from "react-icons/md";
import { FlockFormType, FlockModalPropsExtended, OptionValues } from "@/types";
import SelectCard from "../common/SelectCard";
import { Purpose1, Source } from "@/constants";
import { getHatcheries } from "./action";
import { useBreedStore } from "@/store/breedStandardStore";
import { CiSearch } from "react-icons/ci";

const FlockModal: React.FC<
  FlockModalPropsExtended & { initialData?: FlockFormType | null }
> = ({ closeForm, onSubmit, initialData = null, preselectedHatchery }) => {
  const [formData, setFormData] = useState({
    breedId: initialData?.breedId || "",
    parentBreed: initialData?.parentBreed || "",
    hatcheryId: initialData?.hatcheryId || preselectedHatchery?.id || "",
    maleChickCount: initialData?.maleChickCount || "",
    femaleChickCount: initialData?.femaleChickCount || "",
    productionPurpose: initialData?.productionPurpose || "",
    sourceType: initialData?.sourceType || "",
    dateOfPlacement: initialData?.dateOfPlacement || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    sourceAddress: initialData?.sourceAddress || "",
    maleChickCountFree: initialData?.maleChickCountFree || "",
    femaleChickCountFree: initialData?.femaleChickCountFree || "",
  });

  // const [formData, setFormData] = useState({
  //   breedId: initialData?.breedId || "",
  //   parentBreed: initialData?.parentBreed || "",
  //   hatcheryId: initialData?.hatcheryId || preselectedHatchery?.id || "",
  //   maleChickCount: initialData?.maleChickCount || "100",
  //   femaleChickCount: initialData?.femaleChickCount || "900",
  //   productionPurpose: initialData?.productionPurpose || "BROILER",
  //   sourceType: initialData?.sourceType || "LOCAL",
  //   dateOfPlacement: initialData?.dateOfPlacement || new Date("05-05-2026"),
  //   dateOfBirth: initialData?.dateOfBirth || new Date("05-05-2026"),
  //   sourceAddress: initialData?.sourceAddress || "TESTING X",
  //   maleChickCountFree: initialData?.maleChickCountFree || "10",
  //   femaleChickCountFree: initialData?.femaleChickCountFree || "90",
  // });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FlockFormType, string>>
  >({});
  const [filteredHatcheries, setFilteredHatcheries] = useState<
    { id: number; hatcheryName: string }[]
  >([]);

  const [allHatcheries, setAllHatcheries] = useState<
    { id: number; hatcheryName: string }[]
  >([]);

  const { loadBreed } = useBreedStore();

  const [searchQuery, setSearchQuery] = useState(
    preselectedHatchery?.name || "",
  );
  const [selectedHatchery, setSelectedHatchery] = useState(
    preselectedHatchery?.name || null,
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FlockFormType, string>> = {};

    if (!formData.hatcheryId) newErrors.hatcheryId = "Hatchery is required";
    if (!formData.breedId) newErrors.breedId = "Breed is required";
    if (!formData.maleChickCount)
      newErrors.maleChickCount = "Number of male chicks is required";
    if (!formData.femaleChickCount)
      newErrors.femaleChickCount = "Number of female chicks is required";
    if (!formData.maleChickCountFree)
      newErrors.maleChickCountFree = "Number of male chicks is required";
    if (!formData.femaleChickCountFree)
      newErrors.femaleChickCountFree = "Number of female chicks is required";
    if (!formData.productionPurpose)
      newErrors.productionPurpose = "Purpose is required";
    if (!formData.sourceType) newErrors.sourceType = "Source type is required";
    if (!formData.sourceAddress)
      newErrors.sourceAddress = "Source Address is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.dateOfPlacement)
      newErrors.dateOfPlacement = "Date of placement is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      hatcheryId: Number(formData.hatcheryId),
      breedId: Number(formData.breedId),
      maleChickCount: Number(formData.maleChickCount),
      parentBreed:
        formData.productionPurpose === "BREEDER"
          ? 0
          : Number(formData.parentBreed || 0),
      femaleChickCount: Number(formData.femaleChickCount),
      maleChickCountFree: Number(formData.maleChickCountFree),
      femaleChickCountFree: Number(formData.femaleChickCountFree),
      productionPurpose: formData.productionPurpose,
      sourceType: formData.sourceType,
      dateOfPlacement: formData.dateOfPlacement.toLocaleString(),
      dateOfBirth: formData.dateOfBirth.toLocaleString(),
      sourceAddress: formData.sourceAddress,
    };
    onSubmit(payload);
    closeForm();
    setFormData({
      breedId: initialData?.breedId || "",
      parentBreed: initialData?.parentBreed || 0,
      hatcheryId: initialData?.hatcheryId || "",
      maleChickCount: initialData?.maleChickCount || "",
      femaleChickCount: initialData?.femaleChickCount || "",
      maleChickCountFree: initialData?.maleChickCountFree || "",
      femaleChickCountFree: initialData?.femaleChickCountFree || "",
      productionPurpose: initialData?.productionPurpose || "",
      sourceType: initialData?.sourceType || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      dateOfPlacement: initialData?.dateOfPlacement || "",
      sourceAddress: initialData?.sourceAddress || "",
    });
  };

  const handleCancel = () => {
    closeForm();
    setFormData({
      breedId: "",
      hatcheryId: "",
      maleChickCount: "",
      femaleChickCount: "",
      productionPurpose: "",
      parentBreed: "",
      sourceAddress: "",
      sourceType: "",
      dateOfPlacement: "",
      dateOfBirth: initialData?.dateOfBirth || "",
      maleChickCountFree: "",
      femaleChickCountFree: "",
    });
  };

  const fetchHatcheries = async () => {
    const res = await getHatcheries();
    setAllHatcheries(res?.data ?? []);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectHatchery = (hatchery: {
    id: number;
    hatcheryName: string;
  }) => {
    setFormData((prev) => ({ ...prev, hatcheryId: hatchery.id })); // save ID
    setSelectedHatchery(hatchery.hatcheryName); // selected name for UI
    setSearchQuery(hatchery.hatcheryName); // update input
    setFilteredHatcheries([]);
  };

  const breedOptions: OptionValues[] = [
    { option: "Select Breed", value: "", disable: true },
    ...loadBreed
      .filter((b) => b.generation === "GRANDPARENT")
      .map((b) => ({
        option: `GRANDPARENT - ${b.name}, ${b.count ?? 0}`,
        value: b.id.toString(),
      })),
    ...loadBreed
      .filter((b) => b.generation === "BROILER")
      .map((b) => ({
        option: `BROILER - ${b.name}, ${b.count ?? 0}`,
        value: b.id.toString(),
      })),
    ...loadBreed
      .filter((b) => b.generation === "LAYER")
      .map((b) => ({
        option: `LAYER - ${b.name}, ${b.count ?? 0}`,
        value: b.id.toString(),
      })),
  ];

  const parentOptions: OptionValues[] = [
    { option: "Select Parent", value: "", disable: true },
    ...loadBreed
      .filter((b) => b.generation === "PARENT")
      .map((b) => ({
        option: `${b.name}, ${b.count ?? 0} `,
        value: b.id.toString(),
      })),
  ];
  const readOnly = formData.productionPurpose !== "BREEDER";

  useEffect(() => {
    fetchHatcheries();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredHatcheries([]);
        return;
      }

      const filtered = allHatcheries.filter((h) =>
        h?.hatcheryName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredHatcheries(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, allHatcheries]);

  useEffect(() => {
    if (formData.productionPurpose === "BREEDER") {
      setFormData((prev) => ({
        ...prev,
        parentBreed: initialData?.parentBreed || "",
      }));
    }
  }, [formData.productionPurpose]);

  return (
    <section className="fixed inset-0 bg-black/50 z-30">
      <div className="flex items-center justify-center h-screen ">
        <div className="bg-white max-w-4xl w-full rounded-lg px-5 py-4 flex flex-col gap-2 border border-border">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="modal-title">Add Flock Detail</h1>
              <h2 className="modal-des">
                Record detailed information about a new flock
              </h2>
            </div>
            <MdClose onClick={closeForm} className="cursor-pointer" />
          </div>
          <hr className="h-px border border-border" />
          <div className="flex flex-col w-xs relative px-3">
            {/* Search input */}
            <div className="relative w-full">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg" />
              <input
                type="text"
                placeholder="Search Hatchery"
                className="w-full border border-border rounded-lg px-9 py-2 text-base outline-0 transition duration-200 focus:ring-1 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedHatchery(null);
                }}
                disabled={!!preselectedHatchery}
              />
            </div>
            {errors.hatcheryId && (
              <span className="text-red-500 text-xs mt-1">
                {errors.hatcheryId}
              </span>
            )}

            {/* Dropdown results */}
            {filteredHatcheries.length > 0 && !selectedHatchery && (
              <div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto border border-border rounded-md bg-white shadow-lg z-50 ml-3">
                {filteredHatcheries.map((hatchery) => (
                  <div
                    key={hatchery.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectHatchery(hatchery)}
                  >
                    {hatchery.hatcheryName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 h-[60vh] xl:h-[58vh] 2xl:h-[50vh] overflow-y-auto px-3"
          >
            <div className="flex gap-4">
              <SelectCard
                title="Breed"
                value={formData.breedId.toString()}
                options={breedOptions}
                onChange={handleInputChange}
                name="breedId"
                error={errors.breedId}
              />
              <SelectCard
                title="Category Of Selection"
                value={formData.productionPurpose}
                options={Purpose1}
                onChange={handleInputChange}
                name="productionPurpose"
                error={errors.productionPurpose}
              />
              <SelectCard
                title="Select Parent"
                value={formData.parentBreed.toString()}
                options={parentOptions}
                onChange={handleInputChange}
                name="parentBreed"
                error={errors.breedId}
                className={`${!readOnly ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={!readOnly}
              />
            </div>
            <div className="flex gap-4">
              <InputCard
                name="maleChickCount"
                value={formData.maleChickCount}
                onChange={handleInputChange}
                title="No of Male Chicks"
                type="number"
                placeholder="Enter a no."
                error={errors.maleChickCount}
              />
              <InputCard
                name="femaleChickCount"
                value={formData.femaleChickCount}
                onChange={handleInputChange}
                title="No of Female Chicks"
                type="number"
                placeholder="Enter a no."
                error={errors.femaleChickCount}
              />
            </div>
            <div className="flex gap-4">
              <InputCard
                name="maleChickCountFree"
                value={formData.maleChickCountFree}
                onChange={handleInputChange}
                title="No of Male Chicks(Free)"
                type="number"
                placeholder="Enter a no."
                error={errors.maleChickCountFree}
              />
              <InputCard
                name="femaleChickCountFree"
                value={formData.femaleChickCountFree}
                onChange={handleInputChange}
                title="No of Female Chicks(Free)"
                type="number"
                placeholder="Enter a no."
                error={errors.femaleChickCountFree}
              />
            </div>

            <div className="flex gap-4">
              <SelectCard
                title="Source"
                value={formData.sourceType}
                options={Source}
                onChange={handleInputChange}
                name="sourceType"
                error={errors.sourceType}
              />
              <InputCard
                name="sourceAddress"
                value={formData.sourceAddress}
                onChange={handleInputChange}
                title="Source Address"
                type="text"
                placeholder="Enter a address"
                error={errors.sourceAddress}
              />
            </div>
            <div className="flex gap-4">
              <InputCard
                name="dateOfBirth"
                value={formData.dateOfBirth.toLocaleString()}
                onChange={handleInputChange}
                title="Date of Birth"
                type="date"
                placeholder="Enter a no."
                error={errors.dateOfBirth}
              />
              <InputCard
                name="dateOfPlacement"
                value={formData.dateOfPlacement.toLocaleString()}
                onChange={handleInputChange}
                title="Date of Placement"
                type="date"
                placeholder="Enter a no."
                error={errors.dateOfPlacement}
              />
            </div>

            <div className="flex gap-2 items-end justify-end pt-3">
              <button onClick={handleCancel} className="form-button-cancel">
                Cancel
              </button>
              <button className="form-button-save" type="submit">
                Add Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FlockModal;
