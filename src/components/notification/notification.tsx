"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiBell } from "react-icons/fi";

import NoDataCard from "../common/NoData";
import Pagination from "../common/Pagination";

import {
  getAdminNotifications,
  getMyNotifications,
  markAsRead,
  type Notification,
} from "./notification.api";

/* ------------------------------ Types ------------------------------ */
type RoleType = "ADMIN" | "MODERATOR" | "HATCHERY_MEMBER" | "EXECUTIVE";
type FilterType = "all" | "moderator" | "hatchery_member" | "executive";

const ITEMS_PER_PAGE = 6;

/* --------------------------- Component --------------------------- */
const Notifications = ({ role }: { role?: RoleType }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");

  /* ------------------------ Fetch Notifications ------------------------ */
  const fetchNotifications = useCallback(async () => {
    if (!role) return;

    setLoading(true);
    setError(null);

    try {
      const res =
        role === "ADMIN"
          ? await getAdminNotifications({
              page: currentPage,
              limit: ITEMS_PER_PAGE,
            })
          : await getMyNotifications({
              page: currentPage,
              limit: ITEMS_PER_PAGE,
            });

      setNotifications(res.data ?? []);
      setTotalItems(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch (err: any) {
      console.error("FETCH ERROR:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, [role, currentPage]);

  /* ------------------------ Effects ------------------------ */
  useEffect(() => {
    if (!role) return; // ✅ IMPORTANT
    fetchNotifications();
  }, [role, currentPage, fetchNotifications]);

  /* ------------------------ Role Helpers ------------------------ */
  const hasRole = useCallback((notification: Notification, role: RoleType) => {
    if (!notification.users) return false;

    return notification.users.some((user) =>
      role === "EXECUTIVE" ? user.isExecutive : user.roles?.includes(role),
    );
  }, []);

  /* ------------------------ Visible Tabs ------------------------ */
  const visibleTabs = useMemo<FilterType[]>(() => {
    if (role === "ADMIN")
      return ["all", "moderator", "hatchery_member", "executive"];
    if (role === "MODERATOR") return ["moderator"];
    if (role === "HATCHERY_MEMBER") return ["hatchery_member"];
    if (role === "EXECUTIVE") return ["executive"];
    return [];
  }, [role]);

  /* ------------------------ Filtering ------------------------ */
  const roleBasedNotifications = useMemo(() => {
    // Inbox is already filtered by backend
    if (role !== "ADMIN") return notifications;
    return notifications;
  }, [notifications, role]);

  const filteredNotifications = useMemo(() => {
    if (role !== "ADMIN") return notifications;

    if (filter === "all") return notifications;

    const map: Record<FilterType, RoleType> = {
      all: "ADMIN",
      moderator: "MODERATOR",
      hatchery_member: "HATCHERY_MEMBER",
      executive: "EXECUTIVE",
    };

    return notifications.filter((n) => hasRole(n, map[filter]));
  }, [notifications, filter, role, hasRole]);

  /* ------------------------ Counts ------------------------ */
  const counts = useMemo(
    () => ({
      all: roleBasedNotifications.length,
      moderator: roleBasedNotifications.filter((n) => hasRole(n, "MODERATOR"))
        .length,
      hatchery_member: roleBasedNotifications.filter((n) =>
        hasRole(n, "HATCHERY_MEMBER"),
      ).length,
      executive: roleBasedNotifications.filter((n) => hasRole(n, "EXECUTIVE"))
        .length,
    }),
    [roleBasedNotifications, hasRole],
  );

  const unreadCount = roleBasedNotifications.filter((n) => !n.isRead).length;

  /* ------------------------ Mark as Read ------------------------ */
  const handleMarkAsRead = async (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );

    try {
      await markAsRead(notificationId);
    } catch {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: false } : n,
        ),
      );
    }
  };

  /* ---------------------------- UI ---------------------------- */
  if (!role) {
    return (
      <div className="text-center py-12 text-gray-400">
        Waiting for user role…
      </div>
    );
  }

  const NotificationSkeleton = () => {
    return (
      <div className="p-5 rounded-xl border border-border bg-white animate-pulse space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div> {/* title */}
            <div className="h-3 w-60 bg-gray-200 rounded"></div> {/* message */}
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>{" "}
          {/* button placeholder */}
        </div>
        {/* Timestamp */}
        <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="border border-border rounded-lg px-4 py-5">
        <div className="flex items-center gap-3">
          <FiBell className="text-xl" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Stay updated with important information
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { key: "all", label: "All" },
            { key: "moderator", label: "Moderators" },
            { key: "hatchery_member", label: "Hatchery Members" },
            { key: "executive", label: "Executives" },
          ]
            .filter((t) => visibleTabs.includes(t.key as FilterType))
            .map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key as FilterType);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  filter === key
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}{" "}
                <span className="ml-1 text-xs">
                  {/* ({counts[key as FilterType]}) */}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <NotificationSkeleton key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : filteredNotifications.length === 0 ? (
        <NoDataCard message={""} />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-xl border border-border ${
                n.isRead ? "bg-gray-100" : "bg-white border-blue-300"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{n.title}</h4>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-xs border border-border px-3 rounded"
                  >
                    ✓ Mark read
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default Notifications;
