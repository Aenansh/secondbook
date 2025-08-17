import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="bg-[#1f1f1f] min-h-screen flex justify-center items-center flex-col">
      <div className="bg-[#1f1f1f] rounded-md py-4 w-fit px-4 self-center justify-center items-center gap-3 flex mb-4">
        <Image src={"/logo.svg"} alt="logo" width={40} height={44} />
        <span className="font-semibold text-[32px] md:text-[48px] text-white">
          SecondBook
        </span>
      </div>
      <div>
        <Image
          src={"/assets/icons/loader.svg"}
          alt="loader"
          width={40}
          height={40}
          className="animate-spin"
        />
      </div>
    </div>
  );
};

export default loading;
