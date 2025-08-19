import { getUserByAccount } from "@/actions/user.actions";
import AvatarUpload from "@/components/AvatarUpload";
import Settings from "@/components/Settings";
import Image from "next/image";
import React from "react";

interface Userid {
  userId: string;
}

interface UserParams {
  params: Promise<Userid>;
}

const page = async ({ params }: UserParams) => {
  const userId = ((await params)?.userId as string) || "";
  const profile = await getUserByAccount(userId);
  const user = profile.documents[0];
  return (
    <>
      <div className="min-h-screen bg-[#1f1f1f] flex flex-col justify-center px-32">
        <div className="bg-[#1f1f1f] rounded-md py-4 w-fit px-4 self-center justify-center items-center gap-3 flex mb-4 mt-10">
          <Image src={"/logo.svg"} alt="logo" width={40} height={44} />
          <span className="font-semibold text-[32px] md:text-[48px] text-white">
            SecondBook
          </span>
        </div>
        <div className="flex items-center justify-center flex-col md:gap-6 gap-3">
          <div className="relative z-10">
            <AvatarUpload avatar={user.avatar || "/profile.jpg"} user={user} />
          </div>
          <div className="flex justify-center items-center flex-col md:gap-1 gap-0.5">
            <h1 className="text-4xl text-white">{user.username || "..."}</h1>
            <p className="text-sm text-gray-200">{user.email}</p>
          </div>
        </div>
        <div className="md:self-auto self-center my-4 md:my-8">
          <Settings user={user} />
        </div>
      </div>
    </>
  );
};

export default page;
