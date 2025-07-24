import { Button } from "@/components/ui/button";
import { ArrowRight, BotMessageSquare, BrainCircuit, HeartHandshake, Sparkles } from "lucide-react";
import Link from "next/link";
import DailyAffirmation from "@/components/daily-affirmation";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:2rem_2rem]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Emotion Mentor</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-black">
              <Link href="/mentor">Get Started</Link>
            </Button>
          </nav>
        </header>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-24 md:py-40 text-center">
            <div className="container mx-auto px-6 md:px-10">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                Understand Your Feelings, Find Your Calm.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mt-6">
                Emotion Mentor is your personal AI companion for exploring your
                emotional world. Share what's on your mind and receive gentle,
                insightful analysis to help you understand your feelings better.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild className="bg-primary text-black hover:bg-primary/90 rounded-full text-lg px-8 py-6">
                  <Link href="/mentor">
                    Try the Analyzer
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-black/20">
            <div className="container mx-auto px-6 md:px-10">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">AI-Powered Analysis</h3>
                  <p className="text-gray-400 mt-2">
                    Get instant, confidential insights into your emotional state based on your own words.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                     <HeartHandshake className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Supportive Feedback</h3>
                  <p className="text-gray-400 mt-2">
                    Receive a comforting and uplifting message crafted to match your feelings.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                     <BotMessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Always Available</h3>
                  <p className="text-gray-400 mt-2">
                    Your Emotion Mentor is here for you 24/7, whenever you need to talk.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <DailyAffirmation />
        </main>

        <footer className="py-10 border-t border-gray-800/50">
          <div className="container mx-auto px-6 md:px-10 text-center text-gray-500">
            <p>&copy; 2024 Emotion Mentor. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
