"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardDetails from "./CardDetails";

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

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-[250px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden shadow-lg cursor-pointer"
    >
      {/* Video Container */}
      <div className="relative w-full h-4/5 bg-black">
        <video
          ref={videoRef}
          src={file.url}
          loop
          muted // Start muted
          playsInline
          className="w-full h-full object-cover" // Use object-contain to fit the video
        />
        {/* Mute button overlay */}
        {isHovered && (
          <div className="absolute top-2 right-2">
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
