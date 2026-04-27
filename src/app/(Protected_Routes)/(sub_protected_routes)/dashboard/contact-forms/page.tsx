"use client";
import NoDataCard from "@/components/common/NoData";
import Pagination from "@/components/common/Pagination";
import axiosInstance from "@/lib/axios.utils";
import { truncateText } from "@/utils/truncateText";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { deleteForms, getAllFormSubmission, searchForm } from "./action";
import toast from "react-hot-toast";
import TableSkeleton from "@/components/loader/TableLoader";
import Header from "@/components/common/Header";

type ContactFormType = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
};
const ContactForms = () => {
  const [loadContact, setLoadContact] = useState<ContactFormType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await deleteForms(id);
      toast.success("Deleted successfully.");
      fetchContacts();
    } catch (err) {
      console.error("Unable to delete:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await getAllFormSubmission(1, 5);
      const data = res.data;
      const meta = res.metadata;

      setLoadContact(data);
      setCurrentLimit(meta.limit);
      setCurrentPage(meta.page);
      setTotalItems(meta.total);
      setTotalPages(meta.totalPages);
    } catch (err) {
      console.error("Failed to fetch contact forms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const EMPTY_ROWS_COUNT =
    loadContact.length < currentLimit ? currentLimit - loadContact.length : 0;

  useEffect(() => {
    fetchContacts();
  }, []);

  const contactsToShow = isSearching ? searchResults || [] : loadContact || [];

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchForm(search.trim());
        const form = res.data;
        setSearchResults(form);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <section className="flex flex-col gap-4">
        <Header
          title="Manage Contact Forms"
          des="Manage contact submissions for your hatchery website."
          placeholder="Search Submissions..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : (
          <div className="rounded-md h-full">
            {contactsToShow && contactsToShow.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="table-row">
                    <th className="cell w-[5%]">S.N.</th>
                    <th className="cell w-[10%]">Name</th>
                    <th className="cell w-[8%] text-start">Email</th>
                    <th className="cell w-[10%] text-start">Subject</th>
                    <th className="cell w-[15%] h-full">Message</th>
                    <th className="cell w-[3%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactsToShow.map((contact, i) => (
                    <tr key={contact?.id} className="table-data h-20">
                      <td className="cell">
                        {(currentPage - 1) * currentLimit + i + 1}
                      </td>
                      <td className="cell">{contact?.name}</td>
                      <td className="cell text-start">{contact?.email}</td>
                      <td className="cell text-start">{contact?.subject}</td>
                      <td className="cell">
                        <div className="max-h-16 overflow-y-auto pr-2">
                          {contact?.message}
                        </div>
                      </td>
                      <td className="cell">
                        <MdDeleteOutline
                          className="text-red-500 cursor-pointer text-base text-center w-full"
                          onClick={() => handleDelete(contact.id!)}
                        />
                      </td>
                    </tr>
                  ))}
                  {/*  Empty rows */}
                  {Array.from({ length: EMPTY_ROWS_COUNT }).map((_, index) => (
                    <tr key={`empty-row-${index}`}>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                      <td className="cell">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoDataCard message="No forms submitted." />
            )}
            {!isSearching && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                totalPages={totalPages}
                itemsPerPage={currentLimit}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default ContactForms;
