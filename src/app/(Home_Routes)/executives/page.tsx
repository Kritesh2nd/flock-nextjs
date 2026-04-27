"use client";
import HeroSection from "@/components-home/cards/HeroSection";
import NoDataCard from "@/components-home/cards/NoDataCard";
import Team, { TeamProps } from "@/components-home/cards/Team";
import axiosInstance from "@/lib/axios.utils";
import { getArticleImageUrl } from "@/utils/imageHelper";
import { useEffect, useState } from "react";

const Executives = () => {
  const [loadTeams, setLoadTeams] = useState<TeamProps[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoadingTeams(true);
      const res = await axiosInstance.get("/user/executives");
      const teams = res.data.data;

      setLoadTeams(teams);
    } catch (err) {
      console.error("Failed to fetch Team:", err);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);
  return (
    <>
      <HeroSection
        mediaType="image"
        imgSrc="/home-icon/team.png"
        insetSrc="/home-icon/executive-inset.png"
        title={`The Visionaries Behind<br class="hidden md:block"/> Nepal’s Poultry Industry`}
        des={`Meet the dedicated professionals driving innovation,<br class="hidden md:block"/>  biosecurity, and quality standards at the Nepal Hatchery<br class="hidden md:block"/>  Industries Association.`}
        insetCss="w-full h-full object-contain z-10 top-32 absolute hidden md:block"
        divCss="flex flex-col gap-5 md:gap-20 globalContainer md:items-end items-center justify-end h-full w-full py-20"
      />
      <section className="py-6 md:py-12 flex flex-col gap-8 md:gap-8 globalContainer md:px-16 xl:px-24">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold text-start">
            Our Executive Committee{" "}
          </h1>
          <h2 className="text-base md:text-xl text-primary/50 text-start">
            A collective of experienced professionals dedicated to advancing
            Nepal's hatchery industry.
          </h2>
        </div>
        {loadingTeams ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border border-border rounded-lg p-3"
              >
                <div className="w-full h-60 md:h-80 bg-gray-300 rounded-lg"></div>
                <div className="w-full h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {loadTeams && loadTeams.length > 0 ? (
              <div
                className={`grid w-full gap-6 md:gap-6 ${loadTeams.length <= 3 ? "md:grid-cols-3 grid-cols-1" : "md:grid-cols-4 grid-cols-1"}`}
              >
                {loadTeams.map((team, i) => (
                  <Team
                    key={team.id}
                    firstName={team.firstName}
                    id={team.id}
                    hatchery={team.hatchery}
                    lastName={team.lastName}
                    profileUrl={
                      team.profileUrl
                        ? getArticleImageUrl(team.profileUrl)
                        : "/icons/profile-picture.png"
                    }
                    designation={team.designation}
                  />
                ))}
              </div>
            ) : (
              <NoDataCard
                message="No Executive members data found."
                className="h-120"
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Executives;
