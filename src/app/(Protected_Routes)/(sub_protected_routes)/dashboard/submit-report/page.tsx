"use client";
import InputCard from "@/components/common/InputField";
import SelectCard from "@/components/common/SelectCard";
import { Type } from "@/constants";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosSend } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { postReport } from "./action";

type ReportProps = {
  type: string;
  subject: string;
  description: string;
};
const SubmitReport = () => {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
  });

  const [error, setError] = useState<Partial<ReportProps>>({});

  const validateForm = () => {
    const newErrors: Partial<ReportProps> = {};

    if (!formData.type.trim()) {
      newErrors.type = "Please select a report type";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description cannot be of more than 200 words";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await postReport(formData);
      toast.success("Report Successfully Submitted.");
      setFormData({
        type: "",
        subject: "",
        description: "",
      });
    } catch (err) {
      console.error("Failed to submit report", err);
      toast.error("Failed to send report.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="flex flex-col gap-3 bg-white border border-border rounded-md w-full px-4 py-3">
      <div className="flex gap-1 items-center font-semibold text-xl tracking-wide">
        <RiErrorWarningLine />
        <h1>Submit Report or Complaint</h1>
      </div>
      <p className="text-secondary text-base">
        Report issues, submit complaints or request new features
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <SelectCard
          name="type"
          title="Type"
          value={formData.type}
          onChange={handleInputChange}
          options={Type}
          error={error.type}
        />
        <InputCard
          title="Subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Brief summary of the case."
          error={error.subject}
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-primary text-base tracking-wide">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about your issue/report"
            className={`bg-white text-primary rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 ${
              error.description ? "border-red-500" : "border-border"
            } outline-none`}
          />
          {error && (
            <span className="text-red-500 text-xs mt-1">
              {error.description}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="flex gap-1 items-center justify-center bg-primary text-white p-2 rounded-md w-44 mt-4"
        >
          <IoIosSend />
          <span>Submit Report</span>
        </button>
      </form>
    </section>
  );
};

export default SubmitReport;
