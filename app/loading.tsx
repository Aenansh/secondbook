import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="bg-[#1f1f1f] min-h-screen flex justify-center items-center">
      <div>
        <Image src={"/assets/icons/loader.svg"} alt="loader" width={40} height={40} className="animate-spin" />
      </div>
    </div>
  );
};

export default loading;
