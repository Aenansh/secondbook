import { getAllPosts } from "@/actions/file.actions";
import AudioPlayer from "@/components/AudioCard";
import ImageCard from "@/components/ImageCard";
import VideoCard from "@/components/VideoCard";


const Home = async () => {
  const files = await getAllPosts();
  const posts = files.documents;
  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        <div className="mx-2 md:mx-5 w-full py-4 md:py-8 md:my-10 my-5 px-4 md:px-8 flex flex-wrap gap-4 space-y-6 justify-center">
          {posts
            .filter(
              (post: Post) =>
                post.type === "image" ||
                post.type === "video" ||
                post.type === "audio"
            )
            .map((post: Post) => (
              <div key={post.$id}>
                {post.type === "image" && <ImageCard file={post} user={post.owner} />}
                {post.type === "video" && <VideoCard file={post} user={post.owner} />}
                {post.type === "audio" && <AudioPlayer file={post} user={post.owner} />}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
