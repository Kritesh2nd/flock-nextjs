"use client";
import HeroSection from "@/components-home/cards/HeroSection";
import NoDataCard from "@/components-home/cards/NoDataCard";
import Team, { TeamProps } from "@/components-home/cards/Team";
import Timeline from "@/components-home/cards/Timeline";
import axiosInstance from "@/lib/axios.utils";
import { getArticleImageUrl } from "@/utils/imageHelper";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoGoal } from "react-icons/go";
import { IoMdEye } from "react-icons/io";

const About = () => {
  type MissionProps = {
    icon: React.JSX.Element;
    title: string;
    des: string;
  };
  const Mission: MissionProps[] = [
    {
      icon: <IoMdEye />,
      title: "Mission",
      des: "To modernize Nepal’s poultry infrastructure and maintain a world-class, bio-secure hatchery ecosystem that supports the nation’s 160 Billion NPR poultry investment.",
    },
    {
      icon: <GoGoal />,
      title: "Vision",
      des: "To protect the professional rights of hatchery entrepreneurs, advocate for industry-friendly government policies, and ensure a stable supply of high-vigor Day-Old Chicks (DOCs) to farmers nationwide.",
    },
    {
      icon: <GoGoal />,
      title: "Goal",
      des: "To stabilize the national market for 3.0M weekly chicks, protect the industry's 160B NPR investment, and ensure total biosecurity across all 109 active member hatcheries.",
    },
  ];

  return (
    <div>
      <HeroSection
        mediaType="image"
        imgSrc="/home-icon/about.jpeg"
        insetSrc="/home-icon/about.svg"
        title={`The Unified Voice of
                <br class="hidden md:block" /> Nepal’s Hatchery Sector`}
        des={`The Nepal Hatchery Industries Association (NHIA) is the apex
                <br class="hidden md:block" />
                body representing the specialized breeding and hatchery
                <br class="md:block hidden" /> segment of Nepal's poultry
                industry. Since its inception, NHIA
                <br class="hidden md:block" /> has been instrumental in
                transforming Nepal from an import-
                <br class="hidden md:block" />
                dependent market into a nation that is now nearly 98% self-
                <br class="md:block hidden" />
                sufficient in poultry products.`}
        insetCss="w-full hidden md:block object-cover z-10 absolute top-50 left-[-200]"
        divCss="flex flex-col gap-5 md:gap-20 globalContainer md:items-start items-center justify-end h-full w-full py-20"
      />
      <div className="globalContainer">
        {/* who are we */}
        <section className="py-4 md:py-10">
          <div className="border border-border rounded-2xl shadow-sm">
            <div className="px-4 py-5 flex flex-col md:flex-row gap-6 md:gap-10">
              <Image
                src="/home-icon/who.png"
                alt="Who"
                height={500}
                width={500}
                className="h-100 w-180 rounded-xl object-cover"
              />
              <div className="w-full flex flex-col gap-3 items-start justify-center">
                <h1 className="text-3xl md:text-4xl font-semibold">
                  Who We Are
                </h1>
                <hr className="h-0.5 border-0 w-full bg-linear-to-r from-primary-home to-white mb-3 md:mb-6" />
                <p className="md:text-base text-sm">
                  The Nepal Hatchery Industries Association (NHIA) is the
                  national voice for hatchery entrepreneurs, headquartered in
                  Chabahil, Kathmandu - the poultry capital of Nepal. We
                  represent a vital sector that has invested over Rs 160 Billion
                  into the national economy and act as the key link between
                  private hatchery owners and government regulatory bodies.
                </p>
                <p className="text-sm md:text-base">
                  With a network of 109 broiler and 7 layer hatcheries, NHIA
                  promotes biosecurity, data-driven leadership, and sustainable
                  growth. Our efforts have helped the poultry sector achieve
                  nearly 98% national self-sufficiency, contributing about 4% to
                  Nepal’s GDP and strengthening the country’s food security.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* who are we */}

        {/* mission */}
        <section className="py-4 md:py-14 space-y-3 md:space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Guiding Principles
          </h1>{" "}
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Mission.map((mission, i) => (
              <li
                key={i}
                className="rounded-3xl shadow-md border border-border px-6 py-5 flex flex-col gap-2 bg-[#FFF8DC]/30"
              >
                <div className="bg-[#FFF8DC]/10 shadow-sm rounded-md border border-border w-8 h-8 flex items-center justify-center text-base">
                  {mission.icon}
                </div>
                <h1 className="text-primary font-medium text-xl">
                  {mission.title}
                </h1>
                <p className="text-sm text-primary-text/70">{mission.des}</p>
              </li>
            ))}
          </ul>
        </section>
        {/* mission */}

        {/* history */}
        <section className="py-4 md:py-10 flex flex-col items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Our History
            </h1>
            <h2 className="text-base md:text-xl text-primary/50 text-center">
              Over two decades of innovation and growth
            </h2>
          </div>
          <Timeline />
        </section>
        {/* history */}
      </div>
    </div>
  );
};

export default About;
