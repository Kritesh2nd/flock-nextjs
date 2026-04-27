import HeroSection from "@/components-home/cards/HeroSection";
import AboutSection from "@/components-home/Home/AboutSection";
import MessageSection from "@/components-home/Home/MessageSection";
import NewsSection from "@/components-home/Home/NewsSection";
import TeamSection from "@/components-home/Home/TeamSection";
import { HomeCardData } from "@/constants";
import Image from "next/image";

const Home = () => {
  return (
    <div>
      <HeroSection
        mediaType="video"
        videoSrc="/home-icon/chicken.mp4"
        insetSrc="/home-icon/inset.svg"
        title={`Building a Smarter Future<br class="hidden md:block"/> for Nepal’s Hatchery<br class="hidden md:block"/> Industry`}
        des={`The official voice for Nepal’s hatchery owners. We represent 109<br class="md:block hidden" /> active broiler hatcheries and 7 layer hatcheries dedicated to<br class="md:block hidden" /> national food self-sufficiency.`}
        insetCss="w-full md:w-[68%] h-full object-cover z-10 absolute top-0 hidden md:block"
        divCss="flex flex-col gap-5 md:gap-20 globalContainer md:items-start items-center justify-center h-full w-full"
        btn="Learn More"
        url="#aboutId"
      />
      {/* card */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 md:py-12 globalContainer">
        {HomeCardData.map((card, i) => (
          <div key={i} className="w-full">
            <div
              className="group relative flex flex-col gap-4 items-center justify-center w-full
        border border-border rounded-xl px-4 py-4 overflow-hidden h-46 cursor-pointer"
            >
              {/* animated border */}
              <span className="border-trace shadow-lg"></span>

              <Image
                src={card.img}
                alt="No Image"
                className="h-10 w-10 object-contain"
                height={500}
                width={500}
              />

              <span className="text-2xl font-bold">{card.data}</span>
              <span className="text-base">{card.name}</span>
            </div>
          </div>
        ))}
      </section>
      {/* card */}
      <AboutSection id="aboutId" />
      <MessageSection />
      {/* news section */}
      <NewsSection />
      {/* team */}
      <TeamSection />
      {/* team */}
    </div>
  );
};

export default Home;
