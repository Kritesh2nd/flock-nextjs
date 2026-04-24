import Image from "next/image";
import React from "react";

const MessageSection = () => {
  return (
    <section className="bg-[#F0F5ED]">
      <div className="py-4 md:py-14 globalContainer">
        <div className="px-4 py-5 flex flex-col md:flex-row gap-6 md:gap-10">
          <Image
            src="/home-icon/rajendralamichhane.jpeg"
            alt="Rajendra Sirs"
            height={500}
            width={500}
            className="h-80 md:h-120 w-200 rounded-xl object-contain"
          />
          <div className="w-full flex flex-col items-start justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Message From The President
            </h1>
            <hr className="h-0.5 border-0 w-full bg-linear-to-r from-primary-home to-white mb-3 md:mb-6" />

            <p className="text-sm md:text-base">
              The Nepal Hatchery Industries Association (NHIA) is the leading
              organization representing hatchery entrepreneurs and
              professionals, dedicated to strengthening Nepal’s poultry sector.
              We unite hatchery businesses across the country, supporting
              sustainable growth while safeguarding the interests of our
              members.
            </p>
            <p>
              NHIA serves as a key link between the government and the private
              sector, facilitating collaboration on policies, regulations, and
              industry standards. Through our work, we promote quality,
              biosecurity, innovation, and fair practices, while providing a
              platform to engage members, partners, and stakeholders in
              advancing Nepal’s poultry industry.
            </p>
            <span className="text-base font-bold">Mr. Rajendra Lamichhane</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
