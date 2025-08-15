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
import { toast } from "sonner";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";

const PostMenu = ({ post }: { post: Post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useAccount();

  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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
        <DropdownMenuItem>
          <Link
            href={constructDownloadUrl(post.bucketFileId)}
            download={post.title}
          >
            Download
          </Link>
        </DropdownMenuItem>
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
