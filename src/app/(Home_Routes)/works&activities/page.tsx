import HeroSection from "@/components-home/cards/HeroSection";
import WorksSection from "@/components-home/cards/Works&ActivitiesCard";

const WorksAndActivities = () => {
  return (
    <div className="flex flex-col gap-4">
      <HeroSection
        mediaType="image"
        imgSrc="/home-icon/works.jpg"
        insetSrc="/home-icon/works.svg"
        title={`Driving Growth.
              <br class="hidden md:block" /> Strengthening the Poultry
              <br class="hidden md:block" /> Industry.`}
        des={` We represent hatchery owners and poultry professionals,
              <br class="hidden md:block" /> advocate for fair policies,
              promote innovation, and organize
              <br class="hidden md:block" /> industry programs that ensure
              sustainable growth and
              <br class="hidden md:block" /> national food security.`}
        insetCss="w-full h-165 object-cover z-10 top-0 absolute hidden md:block"
        divCss="flex flex-col gap-5 md:gap-20 globalContainer md:items-start items-center justify-end h-full w-full py-20"
      />
      <WorksSection />
    </div>
  );
};

export default WorksAndActivities;
