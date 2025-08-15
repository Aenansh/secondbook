import { getCurrentUser, getUserByAccount } from "@/actions/user.actions";
import { getUserPosts } from "@/actions/file.actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AvatarUpload from "@/components/AvatarUpload";
import ImageCard from "@/components/ImageCard";
import VideoCard from "@/components/VideoCard";
import AudioPlayer from "@/components/AudioCard";
import { use } from "react";
import Avatar from "@/components/Avatar";
import Settings from "@/components/Settings";

// Assuming User and Post types are globally available
interface Userid {
  userId: string;
}

interface UserParams {
  params: Promise<Userid>;
}
const page = async ({ params }: UserParams) => {
  // Fetch the user whose profile is being viewed
  const userId = ((await params)?.userId as string) || "";
  const profile = await getUserByAccount(userId);
  const currUser = await getCurrentUser();
  if (!profile) {
    return redirect("/");
  }
  const profileUser = profile.documents[0];
  // Fetch all posts for that user
  const files = await getUserPosts(userId);
  const posts: Post[] = files.documents;

  return (
    <>
      <div className="flex bg-[#1f1f1f] min-h-screen items-center flex-col gap-4 md:gap-6 p-8 md:p-16">
        {/* Header */}
        <div className="bg-[#1f1f1f] rounded-md py-4 w-fit px-4 self-center justify-center items-center gap-3 flex mb-4">
          <Image src={"/logo.svg"} alt="logo" width={40} height={44} />
          <span className="font-semibold text-[32px] md:text-[48px] text-white">
            SecondBook
          </span>
        </div>

        {/* Profile Info Section */}
        <div className="flex items-center justify-center flex-col md:gap-6 gap-3">
          <div className="relative z-10">
            {currUser.accountId === userId ? (
              <AvatarUpload
                avatar={profileUser.avatar || "/profile.jpg"}
                user={profileUser}
              />
            ) : (
              <Avatar
                avatar={profileUser.avatar || "/profile.jpg"}
                user={profileUser}
              />
            )}
          </div>
          <div className="flex justify-center items-center flex-col md:gap-1 gap-0.5">
            <h1 className="text-4xl text-white">
              {profileUser.username || "..."}
            </h1>
            <p className="text-sm text-gray-200">{profileUser.email}</p>
          </div>
        </div>
        {/* Posts Grid */}
        <div className="mx-2 md:mx-5 py-4 md:py-8 md:my-10 my-5 px-4 md:px-8 flex flex-wrap gap-6 justify-center">
          {posts.length > 0 ? (
            posts
              // Filter out posts that don't have a URL or a valid owner object
              .filter((post) => post.url && post.owner)
              .map((post) => (
                <div key={post.$id}>
                  {post.type === "image" && (
                    <ImageCard file={post} user={post.owner} />
                  )}
                  {post.type === "video" && (
                    <VideoCard file={post} user={post.owner} />
                  )}
                  {post.type === "audio" && (
                    <AudioPlayer file={post} user={post.owner} />
                  )}
                </div>
              ))
          ) : (
            <p className="text-white text-center">
              This user has no posts yet. <Link className="font-bold" href={`/upload/${userId}`} >Create one?</Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
