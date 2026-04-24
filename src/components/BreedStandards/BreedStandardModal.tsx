import React from "react";
import { MdClose } from "react-icons/md";
import BroilerForm from "./forms/BroilerForm";
import { BreedStandardModalProps } from "@/types/breedStandard";
import LayerForm from "./forms/LayerForm";
import BreedForm from "./forms/BreedForm";

const BreedStandardModal = ({
  onClose,
  formData,
  selectedBreed,
  broilers,
  layers,
  breeders,
  setBroilers,
  setLayers,
  setBreeders,
  onSubmit,
}: BreedStandardModalProps) => {
  return (
    <div>
      <div className="fixed inset-0 h-full bg-black/60">
        <div className="flex items-center justify-center h-full">
          <div className="bg-white w-3xl px-5 py-3 flex flex-col gap-8 rounded-lg">
            <div className="flex justify-between">
              <div>
                <h1 className="modal-title">Add Breed Standards</h1>
                <span className="modal-des">
                  Select a purpose and breed, then enter standard performance
                  data{" "}
                </span>
              </div>
              <MdClose onClick={onClose} className="cursor-pointer text-lg" />
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex gap-4">
                {/* Category - Display only but keep in formData */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="generation"
                    value={selectedBreed?.generation || formData.generation}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {/* Breed Name - Display only but keep breedId in formData */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Breed Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedBreed?.name || "Select Breed"}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 cursor-not-allowed"
                    />
                    {/* Hidden input to store breedId for form submission */}
                    <input
                      type="hidden"
                      name="breedId"
                      value={formData.breedId}
                    />
                  </div>
                </div>
              </div>
              {formData.generation === "BROILER" && (
                <BroilerForm broilers={broilers} setBroilers={setBroilers} />
              )}
              {formData.generation === "LAYER" && (
                <LayerForm layers={layers} setLayers={setLayers} />
              )}
              {(formData.generation === "PARENT" ||
                formData.generation === "GRANDPARENT") && (
                <BreedForm breeders={breeders} setBreeders={setBreeders} />
              )}
              <div className="flex w-full gap-3 items-end justify-end mt-4">
                <button onClick={onClose} className="form-button-cancel">
                  Cancel
                </button>
                <button type="submit" className="form-button-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedStandardModal;
