import { Dispatch, SetStateAction } from "react";
import { BreedTypeProp } from ".";

export type BroilerRow = {
  id?: number;
  day: number;
  weight: number;
  cumulativeMortalityRate: number;
  isNew?: boolean;
};

export type LayerRow = {
  id?: number;
  week: number;
  eggProductionRate: number;
  damagedEggRate: number;
  cumulativeMortalityRate: number;
  isNew?: boolean;
};

export type BreederRow = {
  id?: number;
  week: number;
  hatchableEggRate: number;
  hatchingEggRate: number;
  cumulativeMortalityRate: number;
  isNew?: boolean;
  generation?: "PARENT" | "GRANDPARENT";
};

type FormType = {
  breedId: string;
  generation: string;
};

export type BreedStandardModalProps = {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  formData: FormType;
  selectedBreed?: BreedTypeProp;

  broilers: BroilerRow[];
  layers: LayerRow[];
  breeders: BreederRow[];

  setBroilers: Dispatch<SetStateAction<BroilerRow[]>>;
  setLayers: Dispatch<SetStateAction<LayerRow[]>>;
  setBreeders: Dispatch<SetStateAction<BreederRow[]>>;
};
