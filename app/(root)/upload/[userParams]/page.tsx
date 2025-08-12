"use client";

import { FileUpload } from "@/components/ui/file-upload";
import Image from "next/image";
import { use } from "react";

interface PageParams {
  userParams: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

const page = ({ params }: PageProps ) => {
  const { userParams } = use(params);
  const accountId = userParams;
  return (
    <div className="flex bg-[#1f1f1f] flex-col px-4 md:px-10 py-4 md:pb-25 pb-10">
      <div className="">
        <div className="bg-[#1f1f1f] mt-4 md:mt-6 rounded-md py-4 w-fit px-4 self-center justify-self-center justify-center items-center gap-3 hidden sm:flex">
          <Image src={"/logo.svg"} alt="logo" width={40} height={44} />
          <span className="font-semibold text-[32px] md:text-[48px] text-white flex justify-center gap-1.5 md:gap-2.5 items-baseline">
            SecondBook
          </span>
        </div>
      </div>
      <div className="bg-gray-100 mt-2 mx-10 md:mx-20 md:pt-8 px-8 py-6 md:px-32 md:pb-32 rounded-2xl">
        <FileUpload accountId={accountId} />
      </div>
    </div>
  );
};

export default page;
