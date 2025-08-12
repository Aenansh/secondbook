"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Dialog } from "./ui/dialog";
import { useAccount } from "@/contexts/AccountProvider";

const PostMenu = ({ post }: { post: Post }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {accountId} = useAccount();
  console.log("accountId:", accountId);
  return (
    <>
      <Dialog>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="active:border-none">
            <Image
              src={"/assets/icons/dots.svg"}
              width={20}
              height={20}
              alt="dots"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
};

export default PostMenu;
