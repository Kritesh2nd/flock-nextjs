import { Dispatch, SetStateAction } from "react";

export const useBreedStandardForm = <T extends Record<string, any>>() => {
  const handleChange = (
    setter: Dispatch<SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: any,
    isNumber: boolean = false,
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: isNumber ? Number(value) : value,
      };
      return updated;
    });
  };

  const addRow = (setter: Dispatch<SetStateAction<T[]>>, template: T) => {
    setter((prev) => [...prev, template]);
  };

  const deleteRow = async (
    setter: Dispatch<SetStateAction<T[]>>,
    index: number,
    deleteFn?: (id: number) => Promise<void>,
  ) => {
    setter((prev) => {
      const rowToDelete = prev[index];

      if (rowToDelete.id && deleteFn) {
        deleteFn(rowToDelete.id).catch((err) => {
          console.error("Failed to delete row on server:", err);
        });
      }

      return prev.filter((_, i) => i !== index);
    });
  };
  return { handleChange, addRow, deleteRow };
};
