"use client";
import Image from "next/image";
import React from "react";

interface HeroSectionProps {
  mediaType: "video" | "image";
  title: string;
  des: string;
  insetCss?: string;
  videoSrc?: string;
  insetSrc?: string;
  imgSrc?: string;
  divCss?: string;
  btn?: string;
  url?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  mediaType,
  title,
  des,
  insetCss = "w-full md:w-[68%] h-full object-cover z-10 absolute top-0 hidden md:block",
  videoSrc = "",
  insetSrc,
  imgSrc,
  btn,
  url,
  divCss = "flex flex-col gap-5 md:gap-20 globalContainer md:items-start items-center justify-center h-full w-full",
}) => {
  return (
    <section className="relative w-full h-[580px] md:h-[660px] overflow-hidden">
      {mediaType === "video" && videoSrc ? (
        <video
          src={videoSrc}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : imgSrc ? (
        <Image
          src={imgSrc}
          alt="hero media"
          height={1000}
          width={1000}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      {insetSrc && (
        <Image
          src={insetSrc}
          alt="inset-section"
          height={500}
          width={500}
          className={insetCss}
        />
      )}
      <div className="absolute top-0 h-full w-full z-20 bg-black/20 md:bg-none">
        <div className={divCss}>
          <div className="space-y-5 md:space-y-6">
            <h1
              className="text-4xl md:text-5xl text-white font-bold tracking-wide leading-10 md:leading-14"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p
              className="text-sm md:text-base text-white leading-5 md:leading-6"
              dangerouslySetInnerHTML={{ __html: des }}
            />
            {btn && (
              <button
                onClick={() => {
                  if (url?.startsWith("#")) {
                    const id = url.replace("#", "");
                    const element = document.getElementById(id);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-primary-home px-5 text-lg py-1.5 text-white rounded-lg cursor-pointer"
              >
                {btn}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
