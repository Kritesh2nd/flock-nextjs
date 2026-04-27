"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { LuLoaderCircle } from "react-icons/lu";
import { sendContact } from "./action";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const contact = await sendContact(formData);
      setFormData({ name: "", email: "", subject: "", message: "" });

      if (contact.status == 201) {
        toast.success("Successfully form submitted.");
      }
    } catch (err) {
      console.error("Unable to submit form:", err);
      toast.error("Unable to submit form.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex md:flex-row flex-col globalContainer py-10  gap-5 md:gap-10">
      <section className="flex flex-col gap-3 w-full md:w-[70%]">
        <h1 className="font-bold text-2xl md:text-5xl">Get in Touch</h1>
        <span className="text-base">
          Have a question? Reach out through our form or the contact details
          below.
        </span>

        <div className="space-y-3 pt-5 md:pt-10">
          <span className="font-semibold">Contact Info</span>
          <div className="flex flex-col md:flex-row gap-4 text-primary/50 text-base">
            <div className="flex gap-1 items-center">
              <BiPhone />
              <a href="tel:+97714352616">+977 1-4352616 </a>
            </div>
            <div className="flex gap-1 items-center">
              <CgMail />
              <a href="mailto:hatcheryasso@mail.com.np">
                hatcheryasso@mail.com.np
              </a>
            </div>
            <div className="flex gap-1 items-center">
              <CiLocationOn />
              <a href="https://www.google.com/maps/search/?api=1&query=Balaju,+Kathmandu,+Nepal">
                Balaju, P.O. Box: 4409, Kathmandu, Nepal
              </a>
            </div>
          </div>
        </div>
        <div className="w-full pt-5 md:pt-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28259.94233788595!2d85.3671936!3d27.7020672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1769685062842!5m2!1sen!2snp"
            width="600"
            height="450"
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      </section>

      <section className="flex items-center w-full md:w-[40%]">
        <form className="flex flex-col gap-2 px-4 w-sm" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="px-3 py-2 rounded-md border border-border text-sm"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base">Email</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              className="px-3 py-2 rounded-md border border-border text-sm"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base">Subject</label>
            <input
              type="text"
              placeholder="Subject"
              className="px-3 py-2 rounded-md border border-border text-sm"
              value={formData.subject}
              onChange={handleInputChange}
              name="subject"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base">Message</label>
            <textarea
              placeholder="Message us"
              className="px-3 py-2 rounded-md border border-border text-sm"
              value={formData.message}
              onChange={handleInputChange}
              name="message"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 justify-center text-white rounded-lg px-3 py-2 mt-1 bg-primary-home cursor-pointer"
          >
            {isLoading ? (
              <div className="flex gap-2 items-center">
                <div className="animate-spin">
                  <LuLoaderCircle />
                </div>
                <div className="pt-0.5">Sending...</div>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
