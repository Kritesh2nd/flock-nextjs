"use client";
import axiosInstance from "@/lib/axios.utils";
import { useAuthStore } from "@/store/authstore";
import { useUserStore } from "@/store/userStore";
import { OverviewProps } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { LuBird, LuBuilding2, LuDna } from "react-icons/lu";
import { PiNewspaper } from "react-icons/pi";

const Overview = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const [loadOverview, setLoadOverview] = useState<any>();
  const [loadRecent, setLoadRecent] = useState<any>();
  const router = useRouter();
  const fetchOverview = async () => {
    try {
      const res = await axiosInstance.get("/overview/stats");
      const overview = res.data;
      setLoadOverview(overview);
    } catch (err) {
      console.error("Failed to fetch overview data:", err);
    }
  };

  const fetchRecent = async () => {
    try {
      const data = await axiosInstance.get("/overview/weekly-report");

      const recent = data.data.report;
      setLoadRecent(recent);
    } catch (err) {
      console.error("Failed to fetch recent data:", err);
    }
  };

  const OverviewData: OverviewProps[] = [
    {
      title: "Total Moderators",
      icon: <HiUsers className="text-[#0C8CE8]" />,
      data: loadOverview?.moderators.total ?? 0,
      des: `${loadOverview?.moderators.active ?? 0} active / ${loadOverview?.moderators.inactive ?? 0} inactive`,
    },
    {
      title: "Registered Hatcheries",
      icon: <LuBuilding2 className="text-[#8A38F5]" />,
      data: loadOverview?.totalRegisteredHatcheries ?? 0,
      des: "Total Registered Hatcheries",
    },
    {
      title: "Flock Placements",
      icon: <LuBird className="text-[#CC8800]" />,
      data: loadOverview?.totalFlockPlacements ?? 0,
      des: "Total Flock data",
    },
    {
      title: "Total Members",
      icon: <HiUsers className="text-[#1BAE70]" />,
      data: loadOverview?.members.total ?? 0,
      des: `${loadOverview?.members.active ?? 0} active / ${loadOverview?.members.inactive ?? 0} inactive`,
    },
    {
      title: "Newly Registered",
      icon: <LuBuilding2 className="text-[#696969]" />,
      data: loadOverview?.newlyRegisteredThisYear ?? 0,
      des: "Hatcheries Registered this year",
    },
    {
      title: "Registered Breeds ",
      icon: <LuDna className="text-[#1BAE70]" />,
      data: loadOverview?.totalRegisteredBreeds ?? 0,
      des: "Different Varieties",
    },
  ];

  const RecentActivity = [
    {
      title: "User Registration",
      des: `The total number of user registered this week is ${loadRecent?.userRegistrations ?? 0}`,
      icon: <FaUserAlt className="text-blue-500" />,
      pathname: "/dashboard/user-management",
      color: "bg-[#D0ECFF]",
    },
    {
      title: "Hatchery Registration",
      icon: <LuBuilding2 className="text-[#8A38F5]" />,
      des: `The total number of hatchery registered this week is ${loadRecent?.hatcheriesRegistered ?? 0}`,
      pathname: "/dashboard/all-hatcheries",
      color: "bg-[#EDDFFF]",
    },
    {
      title: "Article Published- Title...",
      icon: <PiNewspaper className="text-[#1BAE70]" />,
      des: `The total number of articles published this week is ${loadRecent?.articlesPublished ?? 0}`,
      pathname: "/dashboard/articles",
      color: "bg-[#B9FFE2]",
    },
    {
      icon: <LuBird className="text-[#CC8800]" />,
      title: "Flock Placement",
      des: `The total number of flocks placed this week is ${loadRecent?.flockPlacements ?? 0}`,
      pathname: "",
      color: "bg-[#FFE6B4]",
    },
  ];

  if (role !== "ARTICLE_MANAGER") {
    useEffect(() => {
      fetchOverview();
    }, []);

    useEffect(() => {
      fetchRecent();
    }, []);
  }

  return (
    <section className="flex flex-col gap-4 2xl:gap-6">
      <ul className="grid grid-cols-4 gap-4 2xl:gap-6 w-full">
        {OverviewData &&
          OverviewData.map((overview, i) => (
            <li
              key={i}
              className="flex flex-col border border-border shadow-sm rounded-xl px-4 py-3 2xl:px-6 2xl:py-6 gap-4 w-full cursor-pointer hover:bg-gray-100 hover:scale-102 transition duration-300"
            >
              <div className="flex justify-between">
                <h2 className="text-lg text-primary font-medium">
                  {overview.title}
                </h2>
                <span className="text-2xl font-medium">{overview.icon}</span>
              </div>
              <p className="text-xl">{overview.data}</p>
              <span className="text-base text-secondary">{overview.des}</span>
            </li>
          ))}
      </ul>
      <section className="h-110 w-full flex flex-col gap-2">
        <h1 className="text-lg 2xl:text-xl font-semibold">Recent Activities</h1>
        <div className="flex flex-col rounded-lg gap-3">
          {RecentActivity.map((recent, i) => (
            <div className="px-4 py-3 border border-border rounded-md" key={i}>
              <div className="flex justify-between">
                <div className="flex items-center gap-4 2xl:gap-6">
                  <span
                    className={`${recent.color} text-lg rounded-full h-10 w-10 flex items-center justify-center`}
                  >
                    {recent.icon}
                  </span>
                  <div>
                    <h1 className="text-base font-medium">{recent.title}</h1>
                    <span className="text-sm text-secondary">{recent.des}</span>
                  </div>
                </div>
                {recent.title !== "Flock Placement" && (
                  <button
                    onClick={() => router.push(recent.pathname)}
                    className="cursor-pointer text-secondary text-sm"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Overview;
