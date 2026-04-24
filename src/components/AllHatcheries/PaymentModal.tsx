import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import InputCard from "../common/InputField";
import { FlockPropsType } from "@/types";
import { addPayment } from "./action";
import toast from "react-hot-toast";

interface PaymentModalProps {
  flock: FlockPropsType;
  hatcheryId: number;
  hatcheryName: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}
const PaymentModal: React.FC<PaymentModalProps> = ({
  flock,
  onClose,
  hatcheryId,
  hatcheryName,
  onPaymentSuccess,
}) => {
  const [paymentData, setPaymentData] = useState({
    hatcheryId: hatcheryId,
    flockId: flock.id,
    amountPaid: "",
    hatcheryName: hatcheryName,
    flockName: flock.breed?.name,
    remainingDues: flock.financials.remainingDues,
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payment = {
        hatcheryId: paymentData.hatcheryId,
        flockId: paymentData.flockId,
        amountPaid: Number(paymentData.amountPaid),
      };
      const res = await addPayment(payment);
      onClose();
      toast.success("Amount paid successfully.");
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err) {
      console.error("Unable to pay amount:", err);
      toast.error("Failed to pay.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="fixed inset-0 bg-black/50 h-full w-full">
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col gap-2 max-w-md w-full px-4 py-3 bg-white rounded-md">
          <div className="flex justify-between">
            <div>
              <h1 className="modal-title">Due Amount.</h1>
              <p className="modal-des">Remaining Due amount.</p>
            </div>
            <MdClose onClick={onClose} className="cursor-pointer" />
          </div>
          <hr className="border border-border w-full" />
          <form onSubmit={handlePayment} className="flex flex-col gap-2">
            <InputCard
              name="hatcheryName"
              type="text"
              title="Hatchery Name"
              value={paymentData.hatcheryName ?? ""}
              onChange={handleAmountChange}
              placeholder="Enter name"
              disabled
            />
            <InputCard
              name="flockName"
              type="text"
              title="Flock"
              value={paymentData.flockName ?? ""}
              onChange={handleAmountChange}
              placeholder="Enter name"
              disabled
            />
            <InputCard
              name="remainingDues"
              type="number"
              title="Remaining Dues"
              value={paymentData.remainingDues}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              disabled
            />
            <InputCard
              name="amountPaid"
              type="number"
              title="Paid Amount"
              value={paymentData.amountPaid}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />

            <div className="flex gap-2 items-end justify-end pt-4">
              <button
                onClick={onClose}
                type="button"
                className="form-button-cancel"
              >
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
  );
};

export default PaymentModal;
