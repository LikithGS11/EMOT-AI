import { Button } from "@/components/ui/button";
import { ArrowRight, BotMessageSquare, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DailyAffirmation from "@/components/daily-affirmation";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:2rem_2rem]"></div>
      </div>
      <div className="relative z-10">
        <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Emotion Mentor</h1>
          </div>
          <nav className="flex items-center gap-4">
             <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/mentor">Get Started</Link>
            </Button>
          </nav>
        </header>

        <main className="py-20 md:py-32">
          <div className="container mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                  Understand Your Feelings, Find Your Calm.
                </h2>
                <p className="text-lg text-gray-400">
                  Emotion Mentor is your personal AI companion for exploring your
                  emotional world. Share what's on your mind and receive gentle,
                  insightful analysis to help you understand your feelings better.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/mentor">
                      Try the Analyzer
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                   <Button size="lg" asChild variant="secondary" className="md:hidden">
                    <Link href="/dashboard">
                      View Dashboard
                      <LayoutDashboard className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Abstract illustration of emotional well-being"
                  fill
                  data-ai-hint="emotional well-being"
                  style={{ objectFit: "cover", opacity: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>
            </div>
          </div>

          <DailyAffirmation />

        </main>

        <footer className="py-10 border-t border-gray-800">
          <div className="container mx-auto px-6 md:px-10 text-center text-gray-500">
            <p>&copy; 2024 Emotion Mentor. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
