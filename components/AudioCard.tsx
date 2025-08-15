"use client";

import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardDetails from "./CardDetails";

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
    <div className="w-[250px] h-[500px] bg-white flex flex-col rounded-xl overflow-hidden shadow-lg">
      {/* Media Area */}
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
