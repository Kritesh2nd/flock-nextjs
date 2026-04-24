"use client";

import Notification from "@/components/notification/notification";
import { useSession } from "next-auth/react";

type RoleType =
  | "ADMIN"
  | "MODERATOR"
  | "HATCHERY_MEMBER"
  | "EXECUTIVE";

const isRoleType = (role?: string): role is RoleType => {
  return (
    role === "ADMIN" ||
    role === "MODERATOR" ||
    role === "HATCHERY_MEMBER" ||
    role === "EXECUTIVE"
  );
};

const NotificationsClient = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user) return null;

  const role = isRoleType(session.user.role)
    ? session.user.role
    : undefined;

  return <Notification role={role} />;
};

export default NotificationsClient;
