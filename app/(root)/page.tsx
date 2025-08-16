import { getAllPosts } from "@/actions/file.actions";
import AudioPlayer from "@/components/AudioCard";
import ImageCard from "@/components/ImageCard";
import VideoCard from "@/components/VideoCard";
import Image from "next/image";

const Home = async () => {
  const files = await getAllPosts();
  const posts = files.documents;
  return (
    <>
      <div className="min-h-screen overflow-x-hidden flex flex-col items-center">
        <div className="py-4 w-fit px-4 self-center justify-center items-center gap-3 flex mb-4">
          <Image src={"/logo-dark.svg"} alt="logo" width={40} height={44} />
          <span className="font-semibold text-[32px] md:text-[48px] text-[#1f1f1f]">
            SecondBook
          </span>
        </div>
        <div className="mx-2 md:mx-5 w-full py-4 md:py-8 md:my-10 my-5 px-4 md:px-8 flex flex-wrap gap-4 space-y-6 justify-center">
          {posts
            .filter(
              (post: Post) =>
                post.type === "image" ||
                post.type === "video" ||
                post.type === "audio"
            )
            .map((post: Post) => (
              <div key={post.$id} className="group [perspective:1000px]">
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
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
