"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import PostMenu from "./PostMenu";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// --- Helper function to format time ---
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// --- Custom Video Player Component ---
const CustomVideoPlayer = ({ file }: { file: Post }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(e.target.value);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={file.url}
        className="w-auto h-auto max-w-full max-h-[85vh] rounded-md"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls && !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={togglePlay} className="bg-black bg-opacity-50 text-white p-4 rounded-full">
          <Play size={40} className="ml-1" />
        </button>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 text-white">
          <button onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <span className="text-xs">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-xs">{formatTime(duration)}</span>
          <button onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Custom Audio Player Component ---
const CustomAudioPlayer = ({ file }: { file: Post }) => {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!waveformRef.current) return;
        const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#A8B5C1',
            progressColor: '#1f1f1f',
            barWidth: 4,
            barRadius: 2,
            height: 100,
            url: file.url,
        });
        wavesurferRef.current = wavesurfer;
        wavesurfer.on('play', () => setIsPlaying(true));
        wavesurfer.on('pause', () => setIsPlaying(false));
        wavesurfer.on('audioprocess', (time) => setCurrentTime(time));
        wavesurfer.on('ready', (d) => setDuration(d));
        wavesurfer.on('finish', () => wavesurfer.seekTo(0));
        return () => wavesurfer.destroy();
    }, [file.url]);

    const handlePlayPause = () => {
        wavesurferRef.current?.playPause();
    };

    return (
        <div className="w-full max-w-lg bg-gray-100 p-6 flex flex-col items-center gap-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-800">{file.title}</h3>
            <div ref={waveformRef} className="w-full"></div>
            <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="bg-black text-white p-4 rounded-full">
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
                <span className="text-sm text-gray-600 font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
        </div>
    );
};


// --- Media Renderer Component ---
const MediaRenderer = ({ file }: { file: Post }) => {
  switch (file.type) {
    case "image":
      return (
        <Image
          src={file.url}
          alt={file.title}
          width={1200}
          height={1200}
          className="w-auto h-auto max-w-full max-h-[85vh] rounded-md"
        />
      );
    case "video":
      return <CustomVideoPlayer file={file} />;
    case "audio":
      return <CustomAudioPlayer file={file} />;
    default:
      return (
        <div className="w-full max-w-md bg-gray-100 flex items-center justify-center rounded-md p-8">
          <p className="text-gray-500">Unsupported file type</p>
        </div>
      );
  }
};


// --- Helper function to format the date string ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


// --- The Main Card Component ---
const LargeMediaCard = ({ file, user }: { file: Post; user: User }) => {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 rounded-2xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 max-w-7xl w-full">
        <div className="flex justify-center flex-shrink-0 w-full lg:w-auto lg:max-w-[65%]">
          <MediaRenderer file={file} />
        </div>
        <div className="w-full lg:w-auto p-4 flex flex-col flex-grow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <Link href={`/profile/${user.$id}`} className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/profile.jpg"}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:underline">{user.username}</p>
                  <p className="text-sm text-gray-500">{formatDate(file.$createdAt)}</p>
                </div>
              </Link>
              <PostMenu post={file} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{file.title}</h2>
            <p className="text-gray-700 leading-relaxed break-words">{file.description}</p>
          </div>
          <div className="mt-8">
            <button className="text-sm font-semibold text-blue-600 hover:underline">
              View Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeMediaCard;
