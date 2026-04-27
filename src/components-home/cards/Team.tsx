import Image from "next/image";

export type TeamProps = {
  id: string;
  profileUrl: string;
  firstName: string;
  lastName: string;
  designation: string;
  hatchery: {
    hatcheryName: string;
  };
};
const Team = ({
  profileUrl,
  firstName,
  lastName,
  hatchery,
  designation,
}: TeamProps) => {
  return (
    <div className="flex flex-col gap-1 md:gap-1 border border-gray-200 p-1 rounded-lg bg-[#FFF8DC]/40 cursor-pointer">
      <Image
        src={profileUrl}
        alt={`${firstName} ${lastName}`}
        height={400}
        width={400}
        className="h-60 md:h-76 w-full rounded-lg bg-gray-300 object-cover"
      />
      <div className="flex flex-col items-center p-1 gap-0 pt-3 pb-4">
        <h1 className="text-lg font-medium">
          {firstName} {lastName}
        </h1>
        <span className="text-base">{designation ? designation : "---"}</span>
        <span className="text-[13px] text-gray-400 -mt-0.5">
          <p>{hatchery?.hatcheryName || "---"}</p>
        </span>
      </div>
    </div>
  );
};

export default Team;
