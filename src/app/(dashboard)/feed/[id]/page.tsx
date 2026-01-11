import { Header } from "@/app/_components/header";
import { api } from "@/server/server-trpc";
import { CreatePostWrapper } from "./_components/create-post-wrapper";
import ListPosts from "./_components/list-posts";

export default async function FeedPage() {
  const trpc = await api();
  const posts = await trpc.post.getAll();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <CreatePostWrapper />
          <ListPosts initialData={posts} />
        </div>
      </main>
    </div>
  );
}
