"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

// Define the interface for the Post object
interface Post {
  title: string;
  description: string;
  url: string;
  $id: string;
  type: string;
}

interface User {
  username: string;
  email: string;
  avatar: string;
  privacy: boolean;
}

const VideoCard = ({ file, user }: { file: Post, user: User }) => {
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
      <div className="flex flex-col">
        <div className="p-3 gap-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold truncate text-gray-800 text-2xl line-clamp-1">
              {file.title}
            </h3>
            <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
              <Image
                src={user?.avatar || "/profile.jpg"}
                alt="profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate line-clamp-1">{file.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
