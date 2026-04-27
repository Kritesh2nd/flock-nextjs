
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import NoDataCard from "@/components/common/NoData";
import Pagination from "@/components/common/Pagination";
import { getAllReport } from "./report";

interface Report {
  id: number;
  title: string;
  type: string;
  message: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 3;


const ReportsManagement = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getAllReport();

        const mappedReports: Report[] = data.map((item: any) => ({
          id: item.id,
          title: item.subject,
          type: item.type.toLowerCase(),
          message: item.description,
          userName: item.reportedBy,
          userEmail: item.email,
          createdAt: new Date(item.submittedAt).toLocaleDateString(),
          updatedAt: new Date(item.submittedAt).toLocaleDateString(),
        }));

        setReports(mappedReports);
        setCurrentPage(1); // reset page on fresh data
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 🔹 Pagination calculations
  const totalItems = reports.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReports = reports.slice(startIndex, endIndex);

const ReportSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm animate-pulse">
      {/* Card Header */}
      <div className="flex justify-between items-start px-6 pt-5">
        <div className="flex items-center gap-3">
          <div className="h-4 w-40 bg-gray-200 rounded"></div> {/* title */}
          <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* type */}
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div> {/* submitted date */}
      </div>

      {/* Message */}
      <div className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 space-y-1">
        <div className="h-3 w-32 bg-gray-200 rounded"></div> {/* userName */}
        <div className="h-3 w-40 bg-gray-200 rounded"></div> {/* userEmail */}
        <div className="h-3 w-20 bg-gray-200 rounded"></div> {/* date */}
      </div>
    </div>
  );
};


  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="border border-gray-200 rounded-lg p-6">
        <Header
          title="ⓘ Reports & Complaints"
          des="Manage user reports and complaints"
          button={`All (${totalItems})`}
          onClick={() => { } } placeholder={""} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
          } } value={""}        />
      </div>

      {/* Reports */}
      <div className="space-y-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => <ReportSkeleton key={idx} />)
        ) : totalItems === 0 ? (
          <NoDataCard message="No reports or complaints found." />
        ) : (
          currentReports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start px-6 pt-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {report.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded-full border border-gray-300 text-gray-600 capitalize">
                    {report.type.replace("_", " ")}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Submitted: {report.updatedAt}
                </span>
              </div>

              {/* Message */}
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600">
                  {report.message.length > 200
                    ? report.message.slice(0, 200) + "..."
                    : report.message}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-800">{report.userName}</p>
                <p className="text-sm text-gray-500">{report.userEmail}</p>
                
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (ONLY show when needed) */}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}



    </section>
  );
};

export default ReportsManagement;


