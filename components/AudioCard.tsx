"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardDetails from "./CardDetails";
import PostMenu from "./PostMenu";

// Props for the AudioPlayer component
interface AudioPlayerProps {
  file: Post;
  user: User;
}
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({ file, user }: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#A8B5C1",
      progressColor: "#1f1f1f", // Darker progress color
      barWidth: 3,
      barRadius: 3,
      barGap: 2,
      height: 60,
      cursorWidth: 0,
      url: file.url,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("audioprocess", (time) => setCurrentTime(time));
    wavesurfer.on("ready", (d) => setDuration(d));
    wavesurfer.on("finish", () => wavesurfer.seekTo(0));

    return () => {
      wavesurfer.destroy();
    };
  }, [file.url]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="w-[250px] h-[500px] relative bg-white flex flex-col rounded-xl overflow-hidden shadow-lg p-1"
    >
      {/* Media Area */}
      <div className="h-[40px] cursor-pointer absolute w-full bg-white flex justify-end px-3">
        <PostMenu post={file} />
      </div>
      <div className="w-full h-4/5 bg-gray-100 flex flex-col items-center justify-center p-4 space-y-6">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center bg-[#1f1f1f] text-white rounded-full w-20 h-20 flex-shrink-0 hover:bg-[#474747] transition-colors"
        >
          {isPlaying ? (
            <Pause size={40} />
          ) : (
            <Play size={40} className="ml-1" />
          )}
        </button>
        <div className="w-full text-center">
          <div ref={waveformRef} className="w-full h-[60px]"></div>
          <div className="text-xs text-gray-500 mt-2">
            <span>{formatTime(currentTime)}</span> /{" "}
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <CardDetails file={file} user={user} />
    </div>
  );
};

export default AudioPlayer;
