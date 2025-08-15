import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostMenu from "./PostMenu";

const CardDetails = ({ file, user }: { file: Post; user: User }) => {
  return (
    <div className="flex flex-col">
      <div className="p-3 gap-1 flex flex-col">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="font-bold truncate text-gray-800 text-2xl line-clamp-1 max-w-[150px]">
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
        <div className="flex justify-between gap-2 items-center px-1">
          <p className="text-sm text-gray-600 truncate line-clamp-1 max-w-[150px]">
            {file.description}
          </p>
            <PostMenu post={file} />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
