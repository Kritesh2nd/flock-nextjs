// "use client";

// import { useSession } from "next-auth/react";
// import Notification from "@/components/notification/notification";

// type RoleType = "ADMIN" | "MODERATOR" | "HATCHERY_MEMBER" | "EXECUTIVE";

// const NotificationsPage = () => {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return (
//       <div className="text-center py-12 text-gray-400">
//         Loading user…
//       </div>
//     );
//   }

//   const role = session?.user?.role as RoleType | undefined;

//   if (!role) {
//     return (
//       <div className="text-center py-12 text-gray-400">
//         Preparing notifications…
//       </div>
//     );
//   }

//   return <Notification role={role} />;
// };

// export default NotificationsPage;
import NotificationsClient from "./NotificationsClient";

export default function Page() {
  return <NotificationsClient />;
}



