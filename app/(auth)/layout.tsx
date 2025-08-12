import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="bg-[#1F1F1F] min-h-screen px-2 md:px-10 flex flex-col md:flex-row justify-center items-center">
        <section className="justify-center items-center flex-col hidden md:flex p-10 w-1/2">
          <div className=" md:hidden px-2 py-4 flex justify-center items-center">
            <div className="flex gap-[12px] md:gap-[24px] flex-col items-start">
              <h1 className="font-semibold text-[24px] md:text-[48px] text-white flex justify-center gap-1.5 md:gap-2.5 items-baseline">
                <Image src={"/logo.svg"} alt="logo" width={28} height={24} />
                <span>SecondBook</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-col justify-evenly items-center">
            <div className="flex gap-[12px] md:gap-[24px] flex-col items-start">
              <h1 className="font-semibold text-[24px] md:text-[48px] text-white flex justify-center gap-1.5 md:gap-2.5 items-baseline">
                <Image src={"/logo.svg"} alt="logo" width={28} height={24} />
                <span>SecondBook</span>
              </h1>
              <p className="text-white text-[16px] md:text-[32px]">
                Your digital canvas for everything.
              </p>
            </div>
            <div>
              <Image
                src={"/assets/images/Illustration.svg"}
                alt="illustration"
                width={538}
                height={538}
              />
            </div>
          </div>
        </section>
        <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0 rounded-lg min-h-[700px]">
          {children}
        </section>
      </div>
    </>
  );
};

export default Layout;
