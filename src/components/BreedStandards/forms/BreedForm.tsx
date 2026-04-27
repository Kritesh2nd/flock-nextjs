import { useBreedStandardForm } from "@/app/hook/useBreedStandardForm";
import { useBreedStore } from "@/store/breedStandardStore";
import { BreederRow } from "@/types/breedStandard";
import React from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteGrandParent, deleteParent } from "../action";

type BreedFormProps = {
  breeders: BreederRow[];
  setBreeders: React.Dispatch<React.SetStateAction<BreederRow[]>>;
};
const BreedForm = ({ breeders, setBreeders }: BreedFormProps) => {
  const { handleChange, addRow, deleteRow } =
    useBreedStandardForm<BreederRow>();
  const { fetchIndividualBreed } = useBreedStore();

  const handleDeleteBreeder = async (
    index: number,
    id?: number,
    generation?: "PARENT" | "GRANDPARENT",
  ) => {
    const row = breeders[index];

    if (row.isNew) {
      setBreeders((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!id) {
      console.error("Cannot delete broiler: missing ID");
      return;
    }

    try {
      if (generation === "PARENT") {
        await deleteParent(id);
        setBreeders((prev) => prev.filter((_, i) => i !== index));
        toast.success(`Parent ${id} data deleted successfully.`);
      } else {
        await deleteGrandParent(id);
        setBreeders((prev) => prev.filter((_, i) => i !== index));
        toast.success(`Grandparent ${id} data deleted successfully.`);
      }
      fetchIndividualBreed();
    } catch (err) {
      console.error("Failed to delete broiler:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 items-center h-70 overflow-y-auto px-3">
      <div className="space-y-3 w-full">
        <div className="flex w-full items-center justify-between border-b border-b-secondary pb-1 font-medium text-base">
          <span className="w-full">Week</span>
          <span className="w-full">Hatchable Egg (%)</span>
          <span className="w-full">Hatching Egg (%)</span>
          <span className="w-full">Cum. Mortality (%)</span>
        </div>
        {breeders.map((row, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-end w-full"
          >
            <input
              type="number"
              value={row.week}
              name="week"
              onChange={(e) =>
                handleChange(setBreeders, index, "week", e.target.value)
              }
              className="bg-white w-full text-primary rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              value={row.hatchableEggRate}
              name="hatchableEggRate"
              onChange={(e) =>
                handleChange(
                  setBreeders,
                  index,
                  "hatchableEggRate",
                  e.target.value,
                )
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              value={row.hatchingEggRate}
              name="hatchingEggRate"
              onChange={(e) =>
                handleChange(
                  setBreeders,
                  index,
                  "hatchingEggRate",
                  e.target.value,
                )
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              name="cumulativeMortalityRate"
              value={row.cumulativeMortalityRate}
              onChange={(e) =>
                handleChange(
                  setBreeders,
                  index,
                  "cumulativeMortalityRate",
                  e.target.value,
                )
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />

            <RiDeleteBinLine
              className="text-gray-400 text-[20px] cursor-pointer w-20"
              onClick={() => handleDeleteBreeder(index, row.id, row.generation)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          addRow(setBreeders, {
            week: 0,
            hatchableEggRate: 0,
            hatchingEggRate: 0,
            cumulativeMortalityRate: 0,
            isNew: true,
          })
        }
        className="flex items-center justify-center gap-1 border border-border rounded-lg px-4 py-2 cursor-pointer"
      >
        <FaPlus />
        Add Row
      </button>
    </div>
  );
};

export default BreedForm;
