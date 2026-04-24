import Image from "next/image";

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative">
      <Image
        src="/bg/bg.png"
        alt="No Bg"
        height={500}
        width={500}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default AuthLayout;
