import { getCurrentUser } from "@/actions/user.actions";
import AvatarUpload from "@/components/AvatarUpload";
import Image from "next/image";
import { getUserPosts } from "@/actions/file.actions";
import { redirect } from "next/navigation";
import ImageCard from "@/components/ImageCard";
import VideoCard from "@/components/VideoCard";
import AudioPlayer from "@/components/AudioCard";
import Link from "next/link";
import { use } from "react";

interface UserId {
  userId: string;
}

interface ParamProps {
  params: Promise<UserId>
}

const page = async ({params} : ParamProps) => {
  // const [loading, setLoading] = useState(false);
  const {userId} = use(params);
  const files = await getUserPosts(userId);

  const posts : Post[] = files.documents;

  return (
    <>
      <div className="flex bg-[#1f1f1f] min-h-screen items-center flex-col gap-4 md:gap-6 p-8 md:p-16">
        <div className="bg-[#1f1f1f] rounded-md py-4 w-fit px-4 self-center justify-center items-center gap-3 flex mb-4">
          <Image src={"/logo.svg"} alt="logo" width={40} height={44} />
          <span className="font-semibold text-[32px] md:text-[48px] text-white flex justify-center gap-1.5 md:gap-2.5 items-baseline">
            SecondBook
          </span>
        </div>
        <div className="flex items-center justify-center flex-col md:gap-6 gap-3">
          <div className="relative z-10">
            <AvatarUpload
              avatar={posts[0].owner.avatar || "/profile.jpg"}
              user={posts[0].owner}
            />
          </div>
          <div className="flex justify-center items-center flex-col md:gap-1 gap-0.5">
            <h1 className="text-4xl text-white">{posts[0].owner.username || "..."}</h1>
            <p className="text-sm text-gray-200">{posts[0].owner.email}</p>
          </div>
        </div>

        <div className="mx-2 md:mx-5 w-full py-4 md:py-8 md:my-10 my-5 px-4 md:px-8 flex flex-wrap gap-6 space-y-6 justify-center">
          {posts.length > 0 ? (
            posts
              .filter(
                (post: Post) =>
                  post.url &&
                  (post.type === "image" ||
                    post.type === "video" ||
                    post.type === "audio")
              )
              .map(async (post: Post) => {
                console.log("post print:", post)
                return (
                  <div key={post.$id}>
                    {post.type === "image" && (
                      <ImageCard file={post} user={post.owner} />
                    )}
                    {post.type === "video" && <VideoCard file={post} user={post.owner} />}
                    {post.type === "audio" && <AudioPlayer file={post} user={post.owner} />}
                  </div>
                );
              })
          ) : (
            <>
              <p className="text-white text-center">
                No posts yet, want to{" "}
                <Link
                  href={`/upload/${posts[0].owner.accountId}`}
                  className="font-semibold"
                >
                  create some?
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default page;