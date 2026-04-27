"use client";
import { SidebarData } from "@/constants";
import { useAuthStore } from "@/store/authstore";
import { AccountProps, Role } from "@/types";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CiLogout } from "react-icons/ci";
import { GrContact } from "react-icons/gr";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiNewspaper } from "react-icons/pi";
import { RiErrorWarningLine } from "react-icons/ri";
import { TbSend } from "react-icons/tb";

const Sidebar = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const pathName = usePathname();
  const Account: AccountProps[] = [
    {
      title: "Articles",
      link: "/dashboard/articles",
      icon: <PiNewspaper />,
      allowedRoles: ["ADMIN", "SUPER_ADMIN", "ARTICLE_MANAGER", "SUPER_ROLE"],
    },
    {
      title: "Contact Forms",
      link: "/dashboard/contact-forms",
      icon: <GrContact />,
      allowedRoles: ["ADMIN", "SUPER_ADMIN", "MODERATOR", "SUPER_ROLE"],
    },
    {
      title: "Notifications",
      link: "/dashboard/notifications",
      icon: <IoMdNotificationsOutline />,
      allowedRoles: ["HATCHERY_MEMBER", "MODERATOR", "SUPER_ROLE"],
    },
    {
      title: "Recovery Bin",
      link: "/dashboard/recovery-bin",
      icon: <MdDeleteOutline className="text-secondary" />,
      allowedRoles: ["ADMIN", "MODERATOR", "SUPER_ADMIN", "SUPER_ROLE"],
    },
  ];
  const AdminTools: AccountProps[] = [
    {
      title: "Manage Notifications",
      link: "/dashboard/manage-notifications",
      icon: <IoNotificationsOutline />,
      allowedRoles: ["ADMIN", "SUPER_ADMIN", "SUPER_ROLE"],
    },
    {
      title: "Manage Reports",
      link: "/dashboard/manage-reports",
      icon: <RiErrorWarningLine />,
      allowedRoles: ["ADMIN", "SUPER_ADMIN", "SUPER_ROLE"],
    },
  ];

  const filteredSidebarData = SidebarData.filter((items) =>
    items.allowedRoles.includes(role as Role),
  );

  const filterAccountData = Account.filter(
    (acc) => !acc.allowedRoles || acc.allowedRoles.includes(role as Role),
  );

  const clearUser = useAuthStore((s) => s.clearUser);

  const roleTitle =
    role === "MODERATOR"
      ? "Moderator"
      : role === "SUPER_ADMIN" || role === "ADMIN" || role === "SUPER_ROLE"
        ? "Admin"
        : role === "HATCHERY_MEMBER"
          ? "Hatchery"
          : role === "ARTICLE_MANAGER"
            ? "Article"
            : "";

  useEffect(() => {
    if (!pathName) {
      window.location.href = "/dashboard/overview";
    }
  }, [pathName]);

  return (
    <aside className="w-68 2xl:w-70 border-r border-gray-200 shadow-md h-screen bg-[#F2F6FC]">
      <div className="border-primary shadow-xs py-3 px-6">
        <div className="flex flex-col gap-0.5 items-start">
          <div className="flex gap-2 items-center justify-center">
            <Image
              src="/icons/Hatchery_Logo.png"
              alt="No Image"
              className="h-10 w-10 object-cover"
              height={200}
              width={200}
              unoptimized
            />
            <h1 className="sidebar-header">{roleTitle} Panel</h1>
          </div>
          <h2 className="sidebar-subheading">System Administrator</h2>
        </div>
      </div>
      <section className="flex flex-col px-3 py-3 gap-3 overflow-y-auto xl:h-[85vh]">
        {role !== "ARTICLE_MANAGER" && (
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold">Main Menu</h1>
            {filteredSidebarData.map((side) => (
              <Link
                href={side.link}
                key={side.link}
                className={`${
                  pathName === side.link
                    ? "bg-blue-100  border-l-4 border-l-[#0C8CE8] text-blue-500"
                    : ""
                } sidebar-link`}
              >
                <Image
                  src={pathName === side.link ? (side.icon1 ?? "") : side.icon}
                  alt="icons"
                  height={100}
                  width={100}
                  className="h-4 w-4"
                />
                <span>{side.title}</span>
              </Link>
            ))}
          </div>
        )}
        {(role === "ADMIN" ||
          role === "SUPER_ADMIN" ||
          role === "SUPER_ROLE") && (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold">Admin Tools</h1>
              <ul className="flex flex-col gap-1">
                {AdminTools.map((tools, i) => (
                  <Link
                    key={i}
                    href={tools.link}
                    className={`${
                      pathName === tools.link
                        ? "bg-blue-100 border-l-4 border-l-[#0C8CE8] text-blue-500"
                        : ""
                    } sidebar-link`}
                  >
                    {tools.icon}
                    {tools.title}
                  </Link>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className="flex flex-col gap-2">
          {role !== "ARTICLE_MANAGER" && (
            <hr className="border border-border" />
          )}
          <h1 className="font-semibold text-base">System</h1>
          <ul className="flex flex-col gap-1">
            {filterAccountData.map((account, i) => (
              <Link
                key={i}
                href={account.link}
                className={`sidebar-link ${
                  pathName === account.link
                    ? "bg-blue-100  border-l-4 border-l-[#0C8CE8] text-blue-500"
                    : ""
                }`}
              >
                {account.icon}
                {account.title}
              </Link>
            ))}
          </ul>
          {role === "HATCHERY_MEMBER" && (
            <Link
              href="/dashboard/submit-report"
              className={`sidebar-link ${
                pathName === "/dashboard/submit-report"
                  ? "bg-blue-100  border-l-4 border-l-[#0C8CE8] text-blue-500"
                  : ""
              } cursor-pointer`}
            >
              <TbSend />
              <span>Submit Report</span>
            </Link>
          )}
          <div className="flex items-start justify-start px-3 cursor-pointer">
            <button
              onClick={() => {
                clearUser();
                signOut({ callbackUrl: "/login", redirect: true });
              }}
              className="text-primary text-sm flex rounded-sm items-center justify-center gap-3 cursor-pointer"
            >
              <CiLogout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
