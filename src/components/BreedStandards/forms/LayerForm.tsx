import { useBreedStandardForm } from "@/app/hook/useBreedStandardForm";
import { LayerRow } from "@/types/breedStandard";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteLayers } from "../action";
import toast from "react-hot-toast";
import { useBreedStore } from "@/store/breedStandardStore";

type LayerFormProps = {
  layers: LayerRow[];
  setLayers: React.Dispatch<React.SetStateAction<LayerRow[]>>;
};
const LayerForm = ({ layers, setLayers }: LayerFormProps) => {
  const { handleChange, addRow } = useBreedStandardForm<LayerRow>();
  const { fetchIndividualBreed } = useBreedStore();

  const handleDeleteLayer = async (index: number, id?: number) => {
    const row = layers[index];

    if (row.isNew) {
      setLayers((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!id) {
      console.error("Cannot delete broiler: missing ID");
      return;
    }

    try {
      await deleteLayers(id);
      setLayers((prev) => prev.filter((_, i) => i !== index));
      fetchIndividualBreed();
      toast.success(`Layer ${id} data deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete broiler:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 items-center h-70 overflow-y-auto px-3">
      <div className="space-y-3 w-full">
        <div className="flex w-full items-center justify-between border-b border-b-secondary pb-1 font-medium text-base">
          <span className="w-full">Week</span>
          <span className="w-full">Total Egg Rate(%)</span>
          <span className="w-full">Damaged Egg Rate(%)</span>
          <span className="w-full">Cum. Mortality Rate(%)</span>
        </div>
        {layers.map((row, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-end w-full"
          >
            <input
              type="number"
              value={row.week}
              name="week"
              onChange={(e) =>
                handleChange(setLayers, index, "week", e.target.value)
              }
              className="bg-white w-full text-primary rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              value={row.eggProductionRate}
              name="eggProductionRate"
              onChange={(e) =>
                handleChange(
                  setLayers,
                  index,
                  "eggProductionRate",
                  e.target.value,
                )
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              value={row.damagedEggRate}
              name="damagedEggRate"
              onChange={(e) =>
                handleChange(setLayers, index, "damagedEggRate", e.target.value)
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />
            <input
              type="number"
              name="cumulativeMortalityRate"
              value={row.cumulativeMortalityRate}
              onChange={(e) =>
                handleChange(
                  setLayers,
                  index,
                  "cumulativeMortalityRate",
                  e.target.value,
                )
              }
              className="bg-white text-primary w-full rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 border-border outline-none"
            />

            <RiDeleteBinLine
              className="text-gray-400 text-[20px] cursor-pointer w-20"
              onClick={() => handleDeleteLayer(index, row.id)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          addRow(setLayers, {
            week: 0,
            eggProductionRate: 0,
            cumulativeMortalityRate: 0,
            damagedEggRate: 0,
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

export default LayerForm;
