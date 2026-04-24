"use client";

import { useBreedStore } from "@/store/breedStandardStore";
import React, { useRef, useState } from "react";
import { MdClose, MdUploadFile } from "react-icons/md";
import Papa from "papaparse";
import { GenerationType } from "@/types";
import { mapRowToInternal } from "@/utils/csvMapper";
import { RiFileExcelFill } from "react-icons/ri";

type CsvModalProps = {
  closeForm: () => void;
  generation: GenerationType;
  onCsvImported?: (rows: any[]) => void;
};

const CsvModal = ({ closeForm, generation, onCsvImported }: CsvModalProps) => {
  const { setCsvData } = useBreedStore();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
  const parseNumber = (value: any) => {
    if (value === undefined || value === null || value === "") return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const transformRows = (rows: any[]) => {
    return rows.map((row) => {
      const mapped = mapRowToInternal(row, generation);

      if (generation === "BROILER") {
        return {
          day: parseNumber(mapped.day),
          weight: parseNumber(mapped.weight),
          cumulativeMortalityRate: parseNumber(mapped.cumulativeMortalityRate),
        };
      }

      if (generation === "LAYER") {
        return {
          week: parseNumber(mapped.week),
          eggProductionRate: parseNumber(mapped.eggProductionRate),
          damagedEggRate: parseNumber(mapped.damagedEggRate),
          cumulativeMortalityRate: parseNumber(mapped.cumulativeMortalityRate),
        };
      }

      if (generation === "PARENT" || generation === "GRANDPARENT") {
        return {
          week: parseNumber(mapped.week),
          hatchableEggRate: parseNumber(mapped.hatchableEggRate),
          hatchingEggRate: parseNumber(mapped.hatchingEggRate),
          cumulativeMortalityRate: parseNumber(mapped.cumulativeMortalityRate),
          generation: generation,
        };
      }
    });
  };

  const validateRowsForGeneration = (
    rows: any[],
    generation: GenerationType,
  ): boolean => {
    return rows.every((row) => {
      if (generation === "BROILER") {
        return (
          row.day !== null &&
          row.weight !== null &&
          row.cumulativeMortalityRate !== null &&
          row.week === undefined
        );
      }

      if (generation === "LAYER") {
        return (
          row.week !== null &&
          row.eggProductionRate !== null &&
          row.damagedEggRate !== null &&
          row.cumulativeMortalityRate !== null
        );
      }

      if (generation === "PARENT" || generation === "GRANDPARENT") {
        return (
          row.week !== null &&
          row.hatchableEggRate !== null &&
          row.hatchingEggRate !== null &&
          row.cumulativeMortalityRate !== null
        );
      }

      return false;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // <-- add this line
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (result) => {
        const rows = result.data as any[];

        const transformed = transformRows(rows);
        if (!transformed) return;
        const isValid = validateRowsForGeneration(transformed, generation);

        if (!isValid) {
          setError(`This csv does not match the ${generation} data format.`);
          return;
        }
        if (
          transformed.some((r) => r && Object.values(r).some((v) => v === null))
        ) {
          setError(
            "Some columns were missing or empty, data may be incomplete.",
          );
        }

        setCsvData(transformed);
        if (onCsvImported) onCsvImported(transformed);
        closeForm();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 h-full w-full">
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-white w-md rounded-md px-5 py-3 flex flex-col gap-8">
          <div className="flex justify-between">
            <div>
              <h1 className="modal-title">Import Breed Standards</h1>
              <span className="modal-des">
                Upload a CSV file with breed standard data
              </span>
            </div>
            <MdClose onClick={closeForm} className="cursor-pointer text-lg" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-semibold">Upload CSV</label>

              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              <div
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setFile(e.dataTransfer.files[0]);
                    setError(null);
                    e.dataTransfer.clearData();
                  }
                }}
                className="border border-dashed border-gray-400 rounded p-6 text-center cursor-pointer hover:bg-gray-50 transition flex flex-col items-center justify-center gap-2"
              >
                {!file ? (
                  <div className="h-20 flex flex-col items-center gap-1">
                    <MdUploadFile size={40} className="text-gray-400" />
                    <span className="text-sm">
                      Drag & Drop here or{" "}
                      <span className="underline">Choose file</span>
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col h-20 items-center">
                      <div className="relative">
                        <RiFileExcelFill className="text-green-400 text-[70px]" />
                        <MdClose
                          size={18}
                          className="text-white cursor-pointer absolute left-1/2 ml-3 top-1 rounded-full bg-red-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        />
                      </div>

                      <div className="flex gap-1 items-center">
                        <span className="text-gray-800 text-base font-medium">
                          {file.name}
                        </span>
                        <span className="text-gray-500 text-[10px] mt-1">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {error && <span className="text-sm text-red-500">{error}</span>}

              <div className="flex justify-between text-xs text-secondary mt-1">
                <span>Supported format: CSV</span>
                <span>Max size: 25MB</span>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="form-button-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="form-button-save">
                  Import
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CsvModal;
