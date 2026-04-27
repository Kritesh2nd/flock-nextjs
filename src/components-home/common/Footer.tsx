import { FooterData } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaRegCopyright } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-[#F0F5ED]">
      <section className="globalContainer py-6 flex flex-col gap-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3 md:gap-4 w-full md:w-[40%] items-center md:items-start text-center md:text-left">
            <Image
              src="/home-icon/hatchery-logo.png"
              alt="Logo"
              height={300}
              width={300}
              className="h-12 w-12 md:h-14 md:w-14"
            />
            <h2 className="text-lg md:text-xl font-semibold text-primary">
              Nepal Hatchery
              <br />
              <span className="text-[#1F2A4480]">Industries Association</span>
            </h2>
            <p className="text-sm md:text-base font-medium text-primary-text">
              Revolutionizing the poultry industry through
              <br className="hidden md:block" /> Data, transparency and
              technology
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-around w-full gap-4 text-center md:text-left">
            {/* Quick Links */}
            <div className="flex flex-col gap-2 md:gap-3">
              <h1 className="text-lg md:text-2xl font-semibold text-[#454545]">
                Quick Links
              </h1>
              <div className="flex flex-col gap-2">
                {FooterData.slice(0, 3).map((quick, i) => (
                  <FooterCard key={i} name={quick.name} link={quick.link} />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-2 md:gap-3">
              <h1 className="text-lg md:text-2xl font-semibold text-[#454545]">
                Resources
              </h1>
              <div className="flex flex-col gap-1 md:gap-2">
                {FooterData.slice(3, 6).map((quick, i) => (
                  <FooterCard key={i} name={quick.name} link={quick.link} />
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2 md:gap-2">
              <h1 className="text-lg md:text-2xl font-semibold text-[#454545]">
                Legal
              </h1>
              <div className="flex flex-col gap-1 md:gap-2">
                {FooterData.slice(5, 8).map((quick, i) => (
                  <FooterCard key={i} name={quick.name} link={quick.link} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 md:pt-14 font-medium">
          <h3 className="text-primary text-base">Find us on</h3>
          <div className="flex items-center gap-5 text-xl text-primary">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="cursor-pointer hover:text-secondary transition" />
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiInstagramFill className="cursor-pointer hover:text-secondary transition" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="cursor-pointer hover:text-secondary transition" />
            </a>
          </div>
        </div>

        <hr className="border border-border" />

        {/* Copyright */}
        <div className="flex gap-1 items-center justify-center pt-4 pb-2 px-4 text-xs md:text-base text-primary-text text-center">
          <FaRegCopyright />
          <p>
            2023 Nepal Hatchery Industries Association. All rights reserved.
          </p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

const FooterCard = ({ link, name }: { link: string; name: string }) => {
  return (
    <Link
      href={link}
      className="text-sm md:text-base font-medium text-primary-text hover:text-primary transition"
    >
      {name}
    </Link>
  );
};
