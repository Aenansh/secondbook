"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface User {
  username: string;
  email: string;
  avatar: string;
  privacy: boolean;
  $id: string;
}

const Avatar = ({ avatar, user }: { avatar: string; user: User }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="active:border-none outline-none">
          {/* THE FIX: This div provides the necessary size and relative
            positioning for the 'fill' prop on the Image component to work.
          */}
          <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Add friend</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Avatar;
