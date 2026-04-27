import { getAllBreed } from "@/app/(Protected_Routes)/(sub_protected_routes)/dashboard/breed/action";
import { getIndividualBreedData } from "@/components/BreedStandards/action";
import { BreedTypeProp, individualBreedProps } from "@/types";
import { create } from "zustand";

interface BreedStore {
  selectedId: string;
  setSelectedId: (id: string) => void;
  loadBreed: BreedTypeProp[];
  fetchBreed: () => Promise<void>;
  isFetchingBreed: boolean;
  individualBreed: individualBreedProps | null;
  fetchIndividualBreed: () => Promise<void>;
  isFetchingIndividualBreed: boolean;
  csvData: any[];
  setCsvData: (data: any[]) => void;
  clearCsvData: () => void;
}

export const useBreedStore = create<BreedStore>((set, get) => ({
  selectedId: "",
  loadBreed: [],
  csvData: [],
  individualBreed: null,
  setSelectedId: (id: string) => set({ selectedId: id }),
  isFetchingBreed: false,
  isFetchingIndividualBreed: false,
  setCsvData: (data) => set({ csvData: data }),
  clearCsvData: () => set({ csvData: [] }),

  fetchBreed: async () => {
    const { selectedId, individualBreed, fetchIndividualBreed } = get();
    // if (loadBreed.length > 0 || isFetchingBreed) return;
    try {
      set({ isFetchingBreed: true });

      const res = await getAllBreed();
      set({
        loadBreed: res,
      });

      if (
        selectedId &&
        (!individualBreed || String(individualBreed.id) !== selectedId)
      ) {
        await fetchIndividualBreed();
      }
    } catch (err) {
      console.error("Failed to fetch Breed:", err);
    } finally {
      set({ isFetchingBreed: false });
    }
  },

  fetchIndividualBreed: async () => {
    const { selectedId } = get();
    if (!selectedId) return;

    // if (individualBreed && individualBreed.id === Number(selectedId)) return;
    try {
      set({ isFetchingIndividualBreed: true });
      const data = await getIndividualBreedData(selectedId);
      set({ individualBreed: data });
    } catch (err) {
      console.error("Unable to fetch individual breed:", err);
    } finally {
      set({ isFetchingIndividualBreed: false });
    }
  },
}));
