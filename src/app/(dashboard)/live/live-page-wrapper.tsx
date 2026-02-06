import { Header } from "@/app/_components/header";
import { LiveMatchesContent } from "./live-matches-content";

export default async function LiveMatchesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <LiveMatchesContent />
      </main>
    </div>
  );
}
