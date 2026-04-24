"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios.utils";
import { MdClose } from "react-icons/md";

interface GenerateReportModalProps {
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  onClose,
}) => {
  const [type, setType] = useState<"monthly" | "yearly">("monthly");
  const [year, setYear] = useState<number | "">("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      const res = await axiosInstance.get(
        "/calculations/reports/available-years",
      );
      setAvailableYears(res.data);
    };
    fetchYears();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = type === "monthly" ? { type, year } : { type };

      const response = await axiosInstance.post(
        "/calculations/reports/export",
        payload,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        type === "monthly" ? `monthly-report-${year}.pdf` : `yearly-report.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error("Report generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-100 flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div>
            <h2 className="modal-title">Generate Report</h2>
            <p className="modal-des">
              Generate your reports based on month or year.
            </p>
          </div>

          <MdClose onClick={onClose} className="cursor-pointer" />
        </div>

        {/* Type Select */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "monthly" | "yearly")}
          className="text-primary w-full  rounded-md py-2 px-4 text-[14px] shadow-xs select border border-border outline-none"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* Year Select */}
        {type === "monthly" && (
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-primary w-full  rounded-md py-2 px-4 text-[14px] shadow-xs select border border-border outline-none"
          >
            <option value="">Select Year</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="form-button-cancel">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="form-button-save"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;
