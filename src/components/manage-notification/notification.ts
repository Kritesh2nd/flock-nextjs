import axiosInstance from "@/lib/axios.utils";
import type { AxiosError } from "axios";
import {User} from "next-auth";

// ────────────────────────────────────────────────
//                  TYPES / INTERFACES
// ────────────────────────────────────────────────

export interface NotificationUser {
  roles: any;
  isExecutive: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isRead: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  totalRecipients: number;
  users: NotificationUser[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  target: string;
  scheduledAt: string | null;
  createdAt: string;
  isSent: boolean;
  isRead: boolean; // Managed by the "me" endpoints
  metadata?: Record<string, any>; // For extra context like links or types
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

export interface PaginatedNotifications {
  total: number;
  totalPages: number;
  limit: number;
  data: Notification[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}


export interface NotificationListParams extends NotificationTargetQuery {
  page?: number;
  limit?: number;
  status?: "sent" | "scheduled" | "all";
  search?: string;
  unreadOnly?: boolean;
}

// ────────────────────────────────────────────────
//             USER NOTIFICATIONS (Inbox)
// ────────────────────────────────────────────────



export const getMyNotifications = async (page: number, limit: number) => {
  const res = await axiosInstance.get(
    `/notifications/me?page=${page}&limit=${limit}`,
  );
  return res.data;
};


export const getAllUser = async () => {
  const res = await axiosInstance.get("/user/all");
  return res.data;
};


/**
 * Mark a specific notification as read
 * PATCH /notifications/:id/read
 */


/**
 * Mark all notifications as read for the current user
 * POST /notifications/me/read-all
 */


// ────────────────────────────────────────────────
//            ADMIN / MANAGEMENT FUNCTIONS
// ────────────────────────────────────────────────

/**
 * Send or schedule a notification to specific roles
 * POST /notifications
 */
export const sendNotification = async (
  payload: NotificationPayload,
  targets: NotificationTargetQuery = {}
): Promise<Notification> => {
  try {
    const response = await axiosInstance.post<Notification>(
      "/notifications",
      payload,
      {
        params: {
          hatcheryMembers: targets.hatcheryMembers ?? false,
          executives: targets.executives ?? false,
          moderators: targets.moderators ?? false,
        },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string | string[] }>;
    console.error("Send notification failed", {
      status: err.response?.status,
      data: err.response?.data,
      payloadSent: payload,
      targetsSent: targets,
    });
    throw new Error(
      (Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message) || "Failed to send notification"
    );
  }
};

/**
 * Fetch global list of notifications (Admin view)
 * GET /notifications
 */
// export const getAdminNotifications = async (
//     params: NotificationListParams = {}
// ): Promise<PaginatedNotifications> => {
//   const response = await axiosInstance.get<PaginatedNotifications>(
//       "/notifications/all",
//       { params }
//   );
//   return response.data;
// };

export const getAdminNotifications = async (
    params: NotificationListParams = {}
): Promise<PaginatedNotifications> => {
  // Set defaults
  const { page = 1, limit = 6, ...rest } = params;

  const response = await axiosInstance.get<PaginatedNotifications>(
      "/notifications/all",
      { params: { page, limit, ...rest } }
  );

  return response.data;
};





