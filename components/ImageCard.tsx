"use client";

import { useState } from "react";
import Image from "next/image";
import PostMenu from "./PostMenu";
import Link from "next/link";
import CardDetails from "./CardDetails";

const ImageCard = ({ file, user }: { file: Post; user: User }) => {
  // State to track hover status to show/hide the UI
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[250px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden shadow-lg cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative w-full h-4/5">
        <Image
          src={file.url}
          alt={file.title}
          width={250}
          height={400} // Corresponds to h-4/5 of 500px
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Section */}
      <CardDetails file={file} user={user} />
    </div>
  );
};

export default ImageCard;
