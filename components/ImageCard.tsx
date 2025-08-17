"use client";

import { MouseEvent, useRef, useState } from "react";
import Image from "next/image";
import PostMenu from "./PostMenu";
import Link from "next/link";
import CardDetails from "./CardDetails";
import { redirect } from "next/navigation";
import { postRoute } from "@/constants";

const ImageCard = ({ file, user }: { file: Post; user: User }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate position relative to the center of the card
    const rotateX = ((y - height / 2) / (height / 2)) * -4; // Invert for natural feel, max 15deg rotation
    const rotateY = ((x - width / 2) / (width / 2)) * 4; // Max 15deg rotation

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-in-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="w-[250px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden shadow-lg cursor-pointer group p-1"
    >
      {/* Image Container */}
      <div className="relative w-full h-4/5" onClick={() => redirect(`/open/${postRoute(file.owner.$id, file.$id)}`)}>
        <div className="h-[40px] cursor-pointer absolute w-full bg-white flex justify-end px-3">
          <PostMenu post={file} />
        </div>
        <Image
          src={file.url}
          alt={file.title}
          width={250}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Section */}
      <CardDetails file={file} user={user} />
    </div>
  );
};

export default ImageCard;
