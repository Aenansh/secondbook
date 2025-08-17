"use client";

import { getPostById } from "@/actions/file.actions";
import { getUserByAccount } from "@/actions/user.actions";
import Image from "next/image";
import { Models } from "node-appwrite";
import React, { useEffect, useState, use } from "react"; // 1. Import 'use'
import { toast } from "sonner";

// 2. Update the params type to be a Promise
const page = ({ params }: { params: Promise<{ postroute: string[] }> }) => {
  // 3. Use the hook to resolve the params promise
  const { postroute } = use(params);

  const ownerAccount = postroute[0];
  const postId = postroute[1];

  const [post, setPost] = useState<Models.Document | null | undefined>(null);
  const [user, setUser] = useState<Models.Document | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function should be defined outside the effect if it doesn't depend on its props
    const getInfo = async () => {
      try {
        const result = await getPostById(postId);
        const userRes = await getUserByAccount(ownerAccount);
        setUser(userRes);
        setPost(result);
      } catch (error) {
        toast.error("No post found!");
      } finally {
        setIsLoading(false);
      }
    };

    // 4. Call the function inside the effect
    getInfo();
  }, [postId]); // 5. The dependency should be postId, not post

  // 6. Add a loading state to prevent errors
  if (isLoading) {
    return (
      <div>
        <Image
          src={"/assets/icons/loader.svg"}
          alt="loader"
          width={40}
          height={40}
          className="animate-spin"
        />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      {/* Image container */}
      <div>
        <Image src={post?.url} alt={post?.name} width={200} height={200} />
      </div>
    </div>
  );
};

export default page;
