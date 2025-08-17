import { getPostById } from "@/actions/file.actions";
import { getUserByAccount } from "@/actions/user.actions";
import LargeImageCard from "@/components/LargeCard";
import Image from "next/image";
import { toast } from "sonner";

const page = async ({
  params,
}: {
  params: Promise<{ postroute: string[] }>;
}) => {
  const postroute = ((await params).postroute as string[]) || [];

  const userDoc = await getUserByAccount(postroute[0]);
  const post = await getPostById(postroute[1]);

  const user = userDoc.documents[0];

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      {/* Image container */}
      <div className="p-6">
        <LargeImageCard file={post} user={user} />
      </div>
    </div>
  );
};

export default page;
