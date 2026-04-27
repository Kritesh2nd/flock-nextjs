"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "../common/Header";
import NoDataCard from "../common/NoData";
import Pagination from "../common/Pagination";
import NotificationModal from "./NotificationModal";

import {
  getAdminNotifications,
  sendNotification,
  type Notification as ApiNotification,
  type NotificationPayload,
  type NotificationTargetQuery,
} from "./notification";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 6;

  /* 🔹 Fetch Notifications */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await getAdminNotifications({
        page: currentPage,
        limit: itemsPerPage,
      });

      setNotifications(apiData.data ?? []);
      setTotalItems(apiData.total ?? 0);
      setTotalPages(apiData.totalPages ?? 1);
    } catch (err: any) {
      setError(
        err.message || "Failed to load notifications. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* 🔹 Create Notification */
  const handleModalSubmit = async (
    data: NotificationPayload,
    targets: NotificationTargetQuery,
  ) => {
    try {
      await sendNotification(data, targets);
      setIsModalOpen(false);
      fetchNotifications();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send notification");
    }
  };
  const SkeletonRow = () => (
    <tr className="animate-pulse bg-white hover:bg-gray-50">
      {/* Title */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>

      {/* Message */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </td>

      {/* Target + Hover Card */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>

      {/* Created At */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
    </tr>
  );

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="border-2 border-border rounded-lg px-7 py-5">
        <Header
          title="Notification Management"
          des="Create and manage system notifications"
          button="Create Notification"
          onClick={() => setIsModalOpen(true)} placeholder={""} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
          } } value={""}        />
      </div>

      {/* Table */}
      <div className="border-2 border-border rounded-xl overflow-hidden  bg-white">
        <h2 className="text-lg font-semibold px-6 py-4 bg-gray-50 border-b-gray-800">
          All Notifications
        </h2>

        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3  text-left text-xs  font-medium uppercase">
                    Notification Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                    Notification Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {/* Render 6 skeleton rows */}
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-600">
            {error}
            <button
              onClick={fetchNotifications}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <NoDataCard message={""} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                      Notification Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                      Notification Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs  font-medium uppercase">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-300">
                  {notifications.map((notif) => {
                    /* 🔹 Role counts */
                    const roleCounts = notif.users.reduce(
                      (acc, user) => {
                        if (user.roles?.includes("MODERATOR")) acc.MODERATOR++;
                        if (user.roles?.includes("HATCHERY_MEMBER"))
                          acc.HATCHERY_MEMBER++;
                        if (user.isExecutive) acc.EXECUTIVE++;
                        return acc;
                      },
                      { MODERATOR: 0, HATCHERY_MEMBER: 0, EXECUTIVE: 0 },
                    );

                    return (
                      <tr key={notif.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{notif.title}</td>

                        <td className="px-6 py-4 text-gray-6s00 max-w-md truncate">
                          {notif.message}
                        </td>

                        {/* Target + Hover Card */}
                        <td className="px-6 py-4">
                          <div className="inline-block group">
                            <span className="cursor-pointer text-blue-600 underline">
                              {notif.totalRecipients} users
                              <span className="ml-2 text-xs text-gray-500">
                                (
                                {roleCounts.EXECUTIVE > 0 &&
                                  `${roleCounts.EXECUTIVE} E`}
                                {roleCounts.EXECUTIVE > 0 &&
                                  (roleCounts.MODERATOR > 0 ||
                                    roleCounts.HATCHERY_MEMBER > 0) &&
                                  ", "}
                                {roleCounts.MODERATOR > 0 &&
                                  `${roleCounts.MODERATOR} M`}
                                {roleCounts.MODERATOR > 0 &&
                                  roleCounts.HATCHERY_MEMBER > 0 &&
                                  ", "}
                                {roleCounts.HATCHERY_MEMBER > 0 &&
                                  `${roleCounts.HATCHERY_MEMBER} H`}
                                )
                              </span>
                            </span>

                            {/* Hover Card */}
                            <div
                              className="
                                fixed z-50
                                opacity-0 invisible
                                group-hover:opacity-100 group-hover:visible
                                transition-opacity duration-200
                                top-1/2 left-[55%] -translate-y-1/2
                                w-96 max-w-[90vw]
                                bg-white border-gray-600 rounded-lg shadow-xl
                                pointer-events-auto
                              "
                            >
                              <div className="max-h-80 overflow-y-auto p-4 space-y-2">
                                {notif.users.map((user) => (
                                  <div
                                    key={user.id}
                                    className="border-b-gray-800 last:border-b-0 pb-2"
                                  >
                                    <p className="font-medium">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {user.email}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {new Date(notif.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t-gray-600 ">
              
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </section>
  );
};

export default NotificationManagement;
