"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useAccount } from "@/contexts/AccountProvider";
import { deletePost } from "@/actions/file.actions";

const PostMenu = ({ post }: { post: Post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAccount();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="active:border-none outline-none text-black">
        <Image
          src={"/assets/icons/menu.svg"}
          width={20}
          height={20}
          alt="dots"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Download</DropdownMenuItem>
        {isMounted && post.owner.$id === userId && (
          <DropdownMenuItem
            className="text-red-600"
            onClick={async () => deletePost(post)}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
