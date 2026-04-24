"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AboutSection = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <section id={id} className="py-4 md:py-14 globalContainer">
      <div className="border border-border rounded-2xl shadow-sm">
        <div className="px-4 py-5 flex flex-col md:flex-row gap-6 md:gap-10">
          <Image
            src="/home-icon/executive.jpeg"
            alt="About"
            height={500}
            width={500}
            className="h-50 md:h-110 w-200 rounded-xl object-cover"
          />
          <div className="w-full flex flex-col items-start justify-center gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold">About Us</h1>
            <hr className="h-0.5 border-0 w-full bg-linear-to-r from-primary-home to-white mb-3 md:mb-6" />

            <h2 className="text-lg md:text-xl font-medium tracking-wide">
              Welcome to Nepal Hatchery Industries
              <br className="hidden md:block" /> Association
            </h2>
            <p className="text-sm md:text-base">
              We represent the collective voice of Nepal’s Poultry Hatchery
              <br className="hidden md:block" />
              Industry. Our aim is to ensure sustainable growth and well-
              <br />
              being of our members.
            </p>

            <button
              onClick={() => router.push("/about")}
              className="bg-primary-home rounded-lg px-3 py-1.5 text-white mt-4 md:mt-8 cursor-pointer"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
    // <section id={id} className="py-4 md:py-14 globalContainer">
    //   <div className=" rounded-2xl">
    //     <div className="px-4 py-5 flex flex-col md:flex-row gap-6 md:gap-16">
    //       <div className="w-full flex flex-col items-end justify-center gap-3">
    //         <h1 className="text-3xl md:text-4xl font-semibold">About Us</h1>
    //         <hr className="h-0.5 border-0 w-full bg-linear-to-l from-primary-home to-white mb-3 md:mb-6" />

    //         <h2 className="text-lg md:text-xl font-medium tracking-wide">
    //           Welcome to Nepal Hatchery Industries
    //           <br className="hidden md:block" /> Association
    //         </h2>
    //         <p className="text-sm md:text-base">
    //           We represent the collective voice of Nepal’s Poultry Hatchery
    //           <br className="hidden md:block" />
    //           Industry. Our aim is to ensure sustainable growth and well-
    //           <br />
    //           being of our members.
    //         </p>

    //         <button
    //           onClick={() => router.push("/about")}
    //           className="bg-primary-home rounded-lg px-3 py-1.5 text-white mt-4 md:mt-8 cursor-pointer"
    //         >
    //           Read More
    //         </button>
    //       </div>
    //       <Image
    //         src="/home-icon/about.png"
    //         alt=""
    //         height={500}
    //         width={500}
    //         className="h-50 md:h-110 w-200 rounded-xl object-cover"
    //       />
    //     </div>
    //   </div>
    // </section>
  );
};

export default AboutSection;
