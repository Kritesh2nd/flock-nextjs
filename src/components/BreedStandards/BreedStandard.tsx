"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaFileCsv, FaPlus } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import {
  postBroilers,
  postGrandParentStandard,
  postLayers,
  postParentStandard,
} from "./action";
import toast from "react-hot-toast";
import { useBreedStore } from "@/store/breedStandardStore";
import LayerView from "./LayerView";
import BroilerView from "./BroilerView";
import BreederView from "./BreederView";
import BreedStandardModal from "./BreedStandardModal";
import CsvModal from "./CsvModal";
import { useAuthStore } from "@/store/authstore";
import { GenerationType } from "@/types";

interface BreedStandardProps {
  breedIdFromPage?: string | null;
}

const BreedStandard = ({ breedIdFromPage }: BreedStandardProps) => {
  const [addStandard, setAddStandard] = useState(false);
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const [addCsv, setAddCsv] = useState(false);
  const {
    selectedId,
    setSelectedId,
    loadBreed,
    fetchIndividualBreed,
    individualBreed,
    csvData,
  } = useBreedStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    generation: "",
    breedId: "",
  });
  const [broilers, setBroilers] = useState<
    {
      id?: number;
      day: number;
      weight: number;
      cumulativeMortalityRate: number;
    }[]
  >([]);

  const [layers, setLayers] = useState<
    {
      id?: number;
      week: number;
      eggProductionRate: number;
      cumulativeMortalityRate: number;
      damagedEggRate: number;
    }[]
  >([]);

  const [breeders, setBreeders] = useState<
    {
      id?: number;
      week: number;
      hatchableEggRate: number;
      cumulativeMortalityRate: number;
      hatchingEggRate: number;
    }[]
  >([]);

  const handleCancel = () => {
    setFormData({ breedId: "", generation: "" });
    setBreeders([]);
    setLayers([]);
    setBroilers([]);
    setAddStandard(false);
  };
  const [csvGeneration, setCsvGeneration] = useState<GenerationType | null>(
    null,
  );

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const generation = formData.generation;

    try {
      if (!individualBreed?.data) {
        toast.error("No existing data found");
        return;
      }
      switch (generation) {
        case "PARENT":
          const payloadP = {
            breedersP: [
              ...individualBreed.data.map((d) => ({
                id: d.id,
                week: Number(d.week),
                hatchableEggRate: Number(d.hatchableEggRate),
                cumulativeMortalityRate: Number(d.cumulativeMortalityRate),
                hatchingEggRate: Number(d.hatchingEggRate),
              })),
              ...breeders
                .filter(
                  (b) =>
                    b.week &&
                    !individualBreed?.data?.some(
                      (d) => Number(d.week) === b.week,
                    ),
                )
                .map((b) => ({
                  week: Number(b.week),
                  hatchableEggRate: Number(b.hatchableEggRate),
                  cumulativeMortalityRate: Number(b.cumulativeMortalityRate),
                  hatchingEggRate: Number(b.hatchingEggRate),
                })),
            ],
          };
          if (payloadP.breedersP.length === 0) {
            toast.error("No parent data to submit");
            return;
          }
          await postParentStandard(formData.breedId, payloadP);
          setBreeders([]);
          break;

        case "GRANDPARENT":
          const payloadGP = {
            breedersGP: [
              ...individualBreed.data.map((d) => ({
                id: d.id,
                week: Number(d.week),
                hatchableEggRate: Number(d.hatchableEggRate),
                cumulativeMortalityRate: Number(d.cumulativeMortalityRate),
                hatchingEggRate: Number(d.hatchingEggRate),
              })),
              ...breeders
                .filter(
                  (b) =>
                    b.week &&
                    !individualBreed?.data?.some(
                      (d) => Number(d.week) === b.week,
                    ),
                )
                .map((b) => ({
                  week: Number(b.week),
                  hatchableEggRate: Number(b.hatchableEggRate),
                  cumulativeMortalityRate: Number(b.cumulativeMortalityRate),
                  hatchingEggRate: Number(b.hatchingEggRate),
                })),
            ],
          };

          if (payloadGP.breedersGP.length === 0) {
            toast.error("No grandparent data to submit");
            return;
          }

          await postGrandParentStandard(formData.breedId, payloadGP);
          setBreeders([]);
          break;

        case "BROILER":
          const broilerPayload = {
            broilers: [
              ...individualBreed.data.map((d) => ({
                id: d.id,
                day: Number(d.day),
                weight: Number(d.weight),
                cumulativeMortalityRate: Number(d.cumulativeMortalityRate),
              })),
              ...broilers
                .filter(
                  (b) =>
                    b.day &&
                    !individualBreed.data?.some((d) => Number(d.day) === b.day),
                )
                .map((b) => ({
                  day: Number(b.day),
                  weight: Number(b.weight),
                  cumulativeMortalityRate: Number(b.cumulativeMortalityRate),
                })),
            ],
          };
          if (broilerPayload.broilers.length === 0) {
            toast.error("No broiler data to submit.");
          }
          await postBroilers(formData.breedId, broilerPayload);
          setBroilers([]);
          break;

        case "LAYER":
          const layerPayload = {
            layers: [
              ...individualBreed.data.map((d) => ({
                id: d.id,
                week: Number(d.week),
                damagedEggRate: Number(d.damagedEggRate),
                eggProductionRate: Number(d.eggProductionRate),
                cumulativeMortalityRate: Number(d.cumulativeMortalityRate),
              })),
              ...layers
                .filter(
                  (b) =>
                    b.week &&
                    !individualBreed.data?.some(
                      (d) => Number(d.week) === b.week,
                    ),
                )
                .map((b) => ({
                  id: b.id,
                  week: Number(b.week),
                  damagedEggRate: Number(b.damagedEggRate),
                  eggProductionRate: Number(b.eggProductionRate),
                  cumulativeMortalityRate: Number(b.cumulativeMortalityRate),
                })),
            ],
          };
          if (layerPayload.layers.length === 0) {
            toast.error("No layer data to submit.");
          }
          await postLayers(formData.breedId, layerPayload);
          setLayers([]);
          break;

        default:
          toast.error("Invalid generation type");
          return;
      }

      const successMessage = {
        PARENT: "Parent breed standards added successfully!",
        GRANDPARENT: "Grandparent breed standards added successfully!",
        BROILER: "Broiler breed standards added successfully!",
        LAYER: "Layer breed standards added successfully!",
      }[generation];

      setFormData({ breedId: "", generation: "" });
      setAddStandard(false);
      toast.success(successMessage);
      fetchIndividualBreed();
    } catch (err) {
      console.error(
        `Unable to add ${generation?.toLowerCase() || "unknown"} breed:`,
        err,
      );
      toast.error(`Unable to add ${generation?.toLowerCase() || "unknown"}.`);
    }
  };

  const closeForm = () => {
    setAddCsv(false);
  };

  const csvLayer = csvData.filter((r: any) => r.generation === "LAYER");
  const csvBroiler = csvData.filter((r: any) => r.generation === "BROILER");
  const csvBreeder = csvData.filter(
    (r: any) => r.generation === "PARENT" || r.generation === "GRANDPARENT",
  );

  useEffect(() => {
    if (breedIdFromPage) {
      // If we're on detail page, set the breed ID
      setSelectedId(breedIdFromPage);
    } else {
      // If we're on main page, clear the selection
      setSelectedId("");
    }
  }, [breedIdFromPage, setSelectedId]);

  useEffect(() => {
    if (selectedId) {
      fetchIndividualBreed();
    }
  }, [selectedId]);

  useEffect(() => {
    if (!addStandard || !individualBreed?.data) return;

    const generation = formData.generation;

    if (generation === "BROILER") {
      setBroilers(
        individualBreed.data.map((d: any) => ({
          id: d.id,
          day: Number(d.day ?? 0),
          weight: Number(d.weight ?? 0),
          cumulativeMortalityRate: Number(d.cumulativeMortalityRate ?? 0),
        })),
      );
    }

    if (generation === "LAYER") {
      setLayers(
        individualBreed.data.map((d: any) => ({
          id: d.id,
          week: Number(d.week ?? 0),
          eggProductionRate: Number(d.eggProductionRate ?? 0),
          damagedEggRate: Number(d.damagedEggRate ?? 0),
          cumulativeMortalityRate: Number(d.cumulativeMortalityRate ?? 0),
        })),
      );
    }

    if (generation === "PARENT" || generation === "GRANDPARENT") {
      setBreeders(
        individualBreed.data.map((d: any) => ({
          id: d.id,
          week: Number(d.week ?? 0),
          hatchableEggRate: Number(d.hatchableEggRate ?? 0),
          hatchingEggRate: Number(d.hatchingEggRate ?? 0),
          cumulativeMortalityRate: Number(d.cumulativeMortalityRate ?? 0),
          generation: individualBreed.generation,
        })),
      );
    }
  }, [addStandard, formData.generation, individualBreed]);

  useEffect(() => {
    if (!addStandard || !csvData) return;

    const generation = formData.generation;

    if (generation === "PARENT" || generation === "GRANDPARENT") {
      const csvRows = csvData
        .filter((r: any) => r.generation === generation)
        .map((r: any) => ({
          week: Number(r.week),
          hatchableEggRate: Number(r.hatchableEggRate),
          hatchingEggRate: Number(r.hatchingEggRate),
          cumulativeMortalityRate: Number(r.cumulativeMortalityRate),
          generation: generation,
        }));

      setBreeders((prev) => {
        const existingWeeks = new Set(prev.map((b) => b.week));
        return [
          ...prev,
          ...csvRows.filter((row) => !existingWeeks.has(row.week)),
        ];
      });
    }

    if (generation === "BROILER") {
      const csvRows = csvData.map((r: any) => ({
        day: Number(r.day),
        weight: Number(r.weight),
        cumulativeMortalityRate: Number(r.cumulativeMortalityRate),
      }));

      setBroilers((prev) => {
        const existingDays = new Set(prev.map((b) => b.day));
        return [
          ...prev,
          ...csvRows.filter((row) => !existingDays.has(row.day)),
        ];
      });
    }

    if (generation === "LAYER") {
      const csvRows = csvData.map((r: any) => ({
        week: Number(r.week),
        eggProductionRate: Number(r.eggProductionRate),
        damagedEggRate: Number(r.damagedEggRate),
        cumulativeMortalityRate: Number(r.cumulativeMortalityRate),
      }));

      setLayers((prev) => {
        const existingWeeks = new Set(prev.map((b) => b.week));
        return [
          ...prev,
          ...csvRows.filter((row) => !existingWeeks.has(row.week)),
        ];
      });
    }

    if (csvData.length > 0 && !addStandard) {
      setAddStandard(true);
      setAddCsv(false);
    }
  }, [addStandard, formData.generation, csvData]);

  const generations = Array.from(new Set(loadBreed.map((b) => b.generation)));

  const selectedBreed = loadBreed.find(
    (breed) => String(breed.id) === selectedId,
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex w-full justify-between items-start">
        <select
          value={selectedId}
          onChange={(e) => {
            const breedId = e.target.value;
            setSelectedId(breedId);
            if (breedId && breedId !== "selectBreed") {
              router.push(`/dashboard/breed-standards/${breedId}`);
            }
          }}
          className="w-100 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option
            value="selectBreed"
            className="cursor-not-allowed opacity-50 text-gray-400"
          >
            Select Breed
          </option>
          {generations.map((gen) => (
            <optgroup key={gen} label={gen} className="bg-gray-200">
              {loadBreed
                .filter((b) => b.generation === gen)
                .map((b) => (
                  <option key={b.id} value={b.id} className="bg-white">
                    {b.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {role !== "MODERATOR" && (
          <div className="flex items-center justify-end gap-4 w-full">
            <button
              className={`${!selectedId ? "cursor-not-allowed" : "cursor-pointer"} flex gap-1.5 items-center rounded-lg border border-primary text-primary px-4 py-2 text-sm`}
              onClick={() => {
                if (selectedBreed) {
                  setCsvGeneration(selectedBreed.generation as GenerationType);
                  setAddCsv(true);
                }
              }}
              disabled={!selectedId}
            >
              <FaFileCsv />
              Upload Csv
            </button>
            <button
              className={`${!selectedId ? "cursor-not-allowed" : "cursor-pointer"} flex gap-1.5 items-center rounded-lg bg-primary text-white px-4 py-2 text-sm`}
              onClick={() => {
                if (selectedId && selectedBreed) {
                  setFormData({
                    generation: selectedBreed.generation,
                    breedId: selectedId,
                  });
                }
                setAddStandard(true);
              }}
              disabled={!selectedId}
            >
              <FaPlus />
              Add Standards
            </button>
          </div>
        )}
      </section>
      {!selectedId ? (
        <section className="border border-border rounded-2xl flex flex-col gap-2 h-[50vh] items-center justify-center">
          <FaChartSimple className="text-[#EAEAEA]" size={40} />
          <span className="text-2xl font-medium">
            Select Category and Breed
          </span>
          <span className="text-xl font-light">
            Choose a purpose and breed from the dropdowns above to view
            standards data.
          </span>
        </section>
      ) : (
        <section>
          {individualBreed?.generation === "LAYER" && (
            <LayerView
              breedName={individualBreed.breedName}
              generation={individualBreed.generation}
              data={individualBreed.data}
            />
          )}

          {individualBreed?.generation === "BROILER" && (
            <BroilerView
              breedName={individualBreed.breedName}
              generation={individualBreed.generation}
              data={individualBreed.data}
            />
          )}

          {(individualBreed?.generation === "GRANDPARENT" ||
            individualBreed?.generation === "PARENT") && (
            <BreederView
              breedName={individualBreed.breedName}
              generation={individualBreed.generation}
              data={individualBreed.data}
            />
          )}
        </section>
      )}
      {addCsv && csvGeneration && (
        <CsvModal
          closeForm={closeForm}
          generation={csvGeneration}
          onCsvImported={(rows) => {
            if (!selectedBreed) return;

            setFormData({
              breedId: selectedBreed.id,
              generation: csvGeneration,
            });
            if (csvGeneration === "LAYER") setLayers(rows);
            if (csvGeneration === "BROILER") setBroilers(rows);
            if (csvGeneration === "PARENT" || csvGeneration === "GRANDPARENT")
              setBreeders(rows);
            setAddStandard(true);
            setAddCsv(false);
          }}
        />
      )}
      {addStandard && (
        <BreedStandardModal
          onSubmit={handleStandardSubmit}
          onClose={handleCancel}
          formData={formData}
          layers={layers.length > 0 ? layers : csvLayer}
          broilers={broilers.length > 0 ? broilers : csvBroiler}
          breeders={breeders.length > 0 ? breeders : csvBreeder}
          setLayers={setLayers}
          setBreeders={setBreeders}
          setBroilers={setBroilers}
          selectedBreed={selectedBreed}
        />
      )}
    </div>
  );
};

export default BreedStandard;
