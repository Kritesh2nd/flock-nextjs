"use client";
import { NavData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { MdClose } from "react-icons/md";

const Navbar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // const [isDropDown, setIsDropDown] = useState<string | null>(null);

  return (
    <nav className="bg-primary-home relative h-14 flex items-center justify-center">
      <div className="globalContainer w-full">
        <div
          aria-expanded={isOpen}
          className="flex md:hidden items-end w-full justify-end text-white transition duration-300"
        >
          {isOpen ? (
            <MdClose
              size={20}
              onClick={() => {
                setIsOpen(false);
                // setIsDropDown(null);
              }}
            />
          ) : (
            <IoMdMenu size={24} onClick={() => setIsOpen(true)} />
          )}
        </div>

        <ul className="hidden md:flex items-center justify-center gap-12 tracking-wider">
          {NavData.map((nav) => (
            <li key={nav.name} className="text-center relative">
              <div className="flex justify-center items-center gap-1 text-white text-base">
                <Link
                  href={nav.link}
                  className={`${pathName === nav.link ? "text-yellow-200" : ""} transition duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {nav.name}
                </Link>
                {/* {nav.subNav && (
                  <FaCaretDown
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropDown(isDropDown === nav.name ? null : nav.name);
                    }}
                  />
                )} */}
              </div>

              {/* {isDropDown === nav.name && nav.subNav && (
                <ul className="absolute right-0 top-full mt-2 bg-white text-primary rounded-md p-2 z-30 min-w-26 shadow-lg">
                  {nav.subNav.map((sub) => (
                    <li
                      key={sub.subName}
                      className="px-3 py-2 rounded hover:bg-gray-100"
                    >
                      <Link
                        href={sub.subLink}
                        className="text-sm block"
                        onClick={() => {
                          setIsOpen(false);
                          setIsDropDown(null);
                        }}
                      >
                        {sub.subName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )} */}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`absolute bg-primary-home w-full z-40 top-full overflow-hidden
    transition-all duration-400 ease-in-out
    ${isOpen ? "max-h-[35vh] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
  `}
      >
        <div className="flex flex-col px-4 py-2">
          <ul className="flex flex-col items-center  justify-center gap-4 pb-10 pt-3  ">
            {NavData.map((nav) => (
              <li key={nav.name} className="w-full text-center">
                <div className="flex justify-center items-center gap-1 text-white">
                  <Link
                    href={nav.link}
                    className={`${
                      pathName === nav.link ? "text-yellow-200" : ""
                    } transition duration-200`}
                    onClick={() => setIsOpen(false)}
                  >
                    {nav.name}
                  </Link>
                  {/* {nav.subNav && (
                    <FaCaretDown
                      className={`${isDropDown === nav.name ? "rotate-180" : ""} transition-all duration-400`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropDown(
                          isDropDown === nav.name ? null : nav.name,
                        );
                      }}
                    />
                  )} */}
                </div>

                {/* {isDropDown === nav.name && nav.subNav && (
                  <ul>
                    {nav.subNav?.map((sub) => (
                      <li
                        key={sub.subName}
                        className="flex flex-col gap-2 pt-2"
                      >
                        <Link
                          href={sub.subLink}
                          className="text-white text-sm"
                          onClick={() => {
                            setIsOpen(false);
                            setIsDropDown(null);
                          }}
                        >
                          {sub.subName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )} */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
