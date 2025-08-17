"use client";

import { useState, useRef, MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardDetails from "./CardDetails";
import PostMenu from "./PostMenu";
import { redirect } from "next/navigation";
import { postRoute } from "@/constants";

const VideoCard = ({ file, user }: { file: Post; user: User }) => {
  // State to track hover status to show/hide the UI
  const [isHovered, setIsHovered] = useState(false);
  // State to manage the video's sound
  const [isMuted, setIsMuted] = useState(true);

  // Ref to get direct access to the <video> DOM element
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to play the video on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Function to pause the video when the mouse leaves
  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-in-out",
    });
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Function to toggle mute/unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card hover events from firing
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-[250px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden shadow-xl cursor-pointer"
    >
      {/* Video Container */}
      <div className="relative w-full h-4/5">
        <div className="h-[40px] absolute z-10 cursor-pointer w-full bg-white flex justify-end px-3">
          <PostMenu post={file} />
        </div>
        <Link href={`/open/${postRoute(file.owner.accountId, file.$id)}`}>
          <video
            ref={videoRef}
            src={file.url}
            loop
            muted // Start muted
            playsInline
            className="w-full h-full object-cover p-1" // Use object-contain to fit the video
          />
        </Link>
        {/* Mute button overlay */}
        {isHovered && (
          <div className="absolute top-12 right-2">
            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Details Section */}
      <CardDetails file={file} user={user} />
    </div>
  );
};

export default VideoCard;
