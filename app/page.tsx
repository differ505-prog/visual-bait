import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black">
      <Navigation />
      <HeroSection />
    </main>
  );
}
