"use client";
import React, { useEffect, useState } from "react";
import NoDataCard from "../cards/NoDataCard";
import { getArticleImageUrl } from "@/utils/imageHelper";
import Team, { TeamProps } from "../cards/Team";
import axiosInstance from "@/lib/axios.utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TeamSection = () => {
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
    <section className="py-4 md:pt-8 md:pb-20 flex flex-col gap-8 md:gap-8 globalContainer">
      <div className="space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-start">
          Executive Members{" "}
        </h1>
        <h2 className="text-base md:text-xl text-primary/50 text-start">
          Meet the experts and visionaries guiding our mission to transform the
          industry{" "}
        </h2>
      </div>
      <div className="relative">
        <button className="custom-swiper-button-P z-10 absolute -left-18 top-38 -translate-y-1/2 text-base md:text-4xl text-black/20 bg-secondary/10 rounded-full p-3 hidden md:block cursor-pointer">
          <FaChevronLeft />
        </button>
        <button className="custom-swiper-button-N absolute -right-18 top-38 -translate-y-1/2 z-10 text-base md:text-4xl text-black/20 bg-secondary/10 rounded-full p-3 hidden md:block cursor-pointer">
          <FaChevronRight />
        </button>
        <Swiper
          className="pb-10"
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          loop={loadTeams.length > 3}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 40 },
          }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            nextEl: ".custom-swiper-button-N",
            prevEl: ".custom-swiper-button-P",
          }}
        >
          {loadingTeams ? (
            [...Array(4)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-2 border border-border rounded-lg p-3">
                  <div className="w-full h-60 md:h-80 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-6 bg-gray-300 rounded"></div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <>
              {loadTeams && loadTeams.length > 0 ? (
                loadTeams.map((team) => (
                  <SwiperSlide key={team.id}>
                    <Team
                      id={team.id}
                      firstName={team.firstName}
                      lastName={team.lastName}
                      hatchery={team.hatchery}
                      profileUrl={
                        team.profileUrl
                          ? getArticleImageUrl(team.profileUrl)
                          : "/icons/profile-picture.png"
                      }
                      designation={team.designation}
                    />
                  </SwiperSlide>
                ))
              ) : (
                <NoDataCard
                  message="No Executive members data found."
                  className="h-100 md:h-120"
                />
              )}
            </>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default TeamSection;
