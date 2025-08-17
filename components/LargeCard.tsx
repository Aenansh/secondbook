import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostMenu from "./PostMenu"; // Assuming you have this component

// --- Media Renderer Component ---
// This component now renders media that fits its container without being cropped.
const MediaRenderer = ({ file }: { file: Post }) => {
  switch (file.type) {
    case "image":
      return (
        <Image
          src={file.url}
          alt={file.title}
          width={1200} // Provide a large base width for quality
          height={1200} // Provide a large base height
          className="w-auto h-auto max-w-full max-h-[85vh] rounded-md"
        />
      );
    case "video":
      return (
        <video
          src={file.url}
          controls
          className="w-auto h-auto max-w-full max-h-[85vh] rounded-md"
        >
          Your browser does not support the video tag.
        </video>
      );
    case "audio":
      return (
        <div className="w-full max-w-md bg-gray-200 p-4 flex flex-col items-center justify-center rounded-md">
          <h3 className="font-semibold text-lg mb-4">{file.title}</h3>
          <audio src={file.url} controls />
        </div>
      );
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
    // This container fills the screen and centers the card content
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 rounded-2xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 max-w-7xl w-full">
        {/* Media Section - centered and flexible */}
        <div className="flex justify-center flex-shrink-0 w-full lg:w-auto lg:max-w-[65%]">
          <MediaRenderer file={file} />
        </div>

        {/* Details Section - grows to fill remaining space */}
        <div className="w-full lg:w-auto p-4 flex flex-col flex-grow">
          <div>
            {/* Author Info and Menu */}
            <div className="flex justify-between items-start mb-4">
              <Link
                href={`/profile/${user.$id}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/profile.jpg"}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 group-hover:underline">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(file.$createdAt)}
                  </p>
                </div>
              </Link>
              <PostMenu post={file} />
            </div>

            {/* Title and Description */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {file.title}
            </h2>
            <p className="text-gray-700 leading-relaxed break-words">
              {file.description}
            </p>
          </div>

          {/* Action Buttons */}
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
