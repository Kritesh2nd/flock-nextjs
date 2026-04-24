



import axiosInstance from "@/lib/axios.utils";
import type { AxiosError } from "axios";

/* ───────────────────────── TYPES ───────────────────────── */

export type NotificationRole =
  | "ADMIN"
  | "MODERATOR"
  | "HATCHERY_MEMBER"
  | "EXECUTIVE";

export interface NotificationUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isRead: boolean;
  roles?: NotificationRole[];
  isExecutive?: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  scheduledAt?: string | null;
  target?: string;
  isSent?: boolean;

  // Inbox-specific
  isRead?: boolean;

  // Admin-specific
  totalRecipients?: number;
  users?: NotificationUser[];

  metadata?: Record<string, any>;
}

export interface NotificationPayload {
  title: string;
  message: string;
  scheduledAt?: string;
}

export interface NotificationTargetQuery {
  hatcheryMembers?: boolean;
  executives?: boolean;
  moderators?: boolean;
}

export interface NotificationListParams
  extends NotificationTargetQuery {
  page?: number;
  limit?: number;
  status?: "sent" | "scheduled" | "all";
  search?: string;
  unreadOnly?: boolean;
}

export interface PaginatedNotifications {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Notification[];
}

/* ───────────────────── USER (INBOX) ───────────────────── */

/** Get current user's notifications */
export const getMyNotifications = async (
  params: { page?: number; limit?: number }
): Promise<PaginatedNotifications> => {
  const res = await axiosInstance.get("/notifications/me", {
    params,
  });
  return res.data;
};

/** Mark one notification as read */
export const markAsRead = async (
  notificationId: number
): Promise<void> => {
  await axiosInstance.patch(
    `/notifications/read/${notificationId}`
  );
};

/** Mark all as read */
export const markAllAsRead = async (): Promise<void> => {
  await axiosInstance.post("/notifications/me/read-all");
};

/* ───────────────────── ADMIN / MANAGEMENT ───────────────────── */

/** Send or schedule a notification */


/** Admin: get all notifications */
// export const getAdminNotifications = async (
//   params: NotificationListParams = {}
// ): Promise<PaginatedNotifications> => {
//   const res = await axiosInstance.get(
//     "/notifications/all",
//     { params }
//   );
//   return res.data;
// };
export const getAdminNotifications = async (
    params: NotificationListParams = {}
): Promise<PaginatedNotifications> => {
  const response = await axiosInstance.get<PaginatedNotifications>(
      "/notifications/all",
      { params }
  );
  return response.data;
};
