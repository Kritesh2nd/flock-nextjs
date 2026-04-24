import { useBreedStandardForm } from "@/app/hook/useBreedStandardForm";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { BroilerRow } from "@/types/breedStandard";
import { deleteBroilers } from "../action";
import toast from "react-hot-toast";
import { useBreedStore } from "@/store/breedStandardStore";

type BroilerFormProps = {
  broilers: BroilerRow[];
  setBroilers: React.Dispatch<React.SetStateAction<BroilerRow[]>>;
};

const BroilerForm = ({ broilers, setBroilers }: BroilerFormProps) => {
  const { handleChange, addRow } = useBreedStandardForm<BroilerRow>();
  const { fetchIndividualBreed } = useBreedStore();

  const handleDeleteBroiler = async (index: number, id?: number) => {
    const row = broilers[index];

    if (row.isNew) {
      setBroilers((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!id) {
      console.error("Cannot delete broiler: missing ID");
      return;
    }

    try {
      await deleteBroilers(id);
      setBroilers((prev) => prev.filter((_, i) => i !== index));
      fetchIndividualBreed();
      toast.success(`Broiler ${id} data deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete broiler:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 items-center h-70 overflow-y-auto px-3">
      <div className="space-y-3 w-full">
        <div className="flex w-full items-center justify-between border-b border-b-secondary pb-1 font-medium text-base">
          <span className="text-start w-full">Day</span>
          <span className="text-start w-full">Weight(g)</span>
          <span className="text-start w-full">Cum. Mortality Rate(g)</span>
        </div>

        {broilers.map((row, index) => {
          return (
            <div
              key={index}
              className="flex gap-4 items-center justify-end w-full"
            >
              <input
                type="number"
                value={row.day}
                onChange={(e) =>
                  handleChange(
                    setBroilers,
                    index,
                    "day",
                    Number(e.target.value),
                  )
                }
                className="bg-white w-full text-primary rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
              />
              <input
                type="number"
                value={row.weight}
                onChange={(e) =>
                  handleChange(
                    setBroilers,
                    index,
                    "weight",
                    Number(e.target.value),
                  )
                }
                className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
              />
              <input
                type="number"
                value={row.cumulativeMortalityRate}
                onChange={(e) =>
                  handleChange(
                    setBroilers,
                    index,
                    "cumulativeMortalityRate",
                    Number(e.target.value),
                  )
                }
                className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
              />

              <RiDeleteBinLine
                className="text-gray-400 text-[20px] cursor-pointer w-20"
                onClick={() => handleDeleteBroiler(index, row.id)}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          addRow(setBroilers, {
            day: 0,
            weight: 0,
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

export default BroilerForm;
