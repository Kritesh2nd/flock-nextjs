"use client";
import { HeaderProps } from "@/types";
import { usePathname } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

const Header: React.FC<HeaderProps> = ({
  title,
  des,
  button,
  button2,
  onClick,
  onClick1,
  placeholder,
  onChange,
  value,
}) => {
  const pathName = usePathname();
  return (
    <header className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg text-primary font-medium 2xl:text-xl">
          {title}
        </h1>
        <span className="text-base text-secondary">{des}</span>
      </div>
      <div className="flex gap-5 py-3 h-16">
        {pathName !== "/dashboard/manage-notifications" &&
          pathName !== "/dashboard/manage-reports" &&
          pathName !== "/dashboard/calculation" && (
            <div className="flex flex-col w-3xs relative">
              <div className="relative w-full text-sm">
                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg" />
                <input
                  type="text"
                  placeholder={placeholder}
                  className="w-full border border-border rounded-lg px-9 py-2"
                  onChange={onChange}
                  value={value}
                />
              </div>
              {value && value.length > 0 && value.length < 3 && (
                <p className="text-xs pt-1 px-3 text-secondary">
                  At least 3 letters required.
                </p>
              )}
            </div>
          )}
        {pathName !== "/dashboard/contact-forms" && (
          <button className="add-btn h-9" onClick={onClick}>
            {pathName !== "/dashboard/manage-reports" && <FaPlus />}
            <span>{button}</span>
          </button>
        )}
        {pathName === "/dashboard/all-hatcheries" && (
          <button className="add-btn h-9" onClick={onClick1}>
            <FaPlus />
            <span>{button2}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
