import { Button } from "@/components/ui/button";
import { ArrowRight, BotMessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Emotion Mentor</h1>
        </div>
        <nav>
          <Button asChild>
            <Link href="/mentor">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Understand Your Feelings, Find Your Calm.
              </h2>
              <p className="text-lg text-muted-foreground">
                Emotion Mentor is your personal AI companion for exploring your
                emotional world. Share what's on your mind and receive gentle,
                insightful analysis to help you understand your feelings better.
              </p>
              <Button size="lg" asChild>
                <Link href="/mentor">
                  Try the Analyzer
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Abstract illustration of emotional well-being"
                layout="fill"
                objectFit="cover"
                data-ai-hint="emotional well-being"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t">
        <div className="container mx-auto px-6 md:px-10 text-center text-muted-foreground">
          <p>&copy; 2024 Emotion Mentor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
