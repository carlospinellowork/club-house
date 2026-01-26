"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { AppRouter } from "@/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { PostCard } from "./post-card";

type RouterOutput = inferRouterOutputs<AppRouter>;
type PostsOutput = RouterOutput["post"]["getAll"];

interface ListPostsProps {
  initialData: PostsOutput;
}

const ListPosts = ({ initialData }: ListPostsProps) => {
  const { data: post, isLoading } = trpc.post.getAll.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        post?.map((post) => <PostCard key={post.id} postCard={post} />)
      )}
    </div>
  );
};

export default ListPosts;
