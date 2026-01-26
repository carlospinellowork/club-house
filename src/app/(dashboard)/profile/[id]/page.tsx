import { MemberProfile } from "@/app/(dashboard)/profile/_components/member-profile";
import { Header } from "@/app/_components/header";
import { api } from "@/server/server-trpc";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await api();
  const member = await trpc.member.getById({ id });
  const posts = await trpc.member.getAllPostsByMember({ id });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-6 max-w-4xl">
        <MemberProfile initialMember={member} initialPosts={posts} />
      </section>
    </div>
  );
}
