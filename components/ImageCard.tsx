"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDownToLine, Trash2 } from "lucide-react"; // Example icon
import PostMenu from "./PostMenu";
import Link from "next/link";
import { deletePost } from "@/actions/file.actions";

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
        {/* Overlay UI that appears on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-opacity-20 flex items-start justify-end p-2 transition-opacity duration-300 rounded-full">
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent other clicks
                // Add download or save logic here
                console.log("Save button clicked!");
              }}
              className="bg-[#1f1f1f] bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 cursor-pointer"
            >
              <PostMenu post={file} />
              {/* <Trash2 onClick={async () => deletePost(file)} /> */}
            </div>
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
            <Link
              href={`/profile/${file.owner.accountId}`}
              className="relative w-[30px] h-[30px] rounded-full overflow-hidden"
            >
              <Image
                src={user?.avatar || "/profile.jpg"}
                alt="profile"
                fill
                className="object-cover"
              />
            </Link>
          </div>
          <p className="text-sm text-gray-600 truncate line-clamp-1">
            {file.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
