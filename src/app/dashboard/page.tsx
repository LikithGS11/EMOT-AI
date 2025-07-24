import MoodDashboardClient from "@/components/mood-dashboard/mood-dashboard-client";
import { ArrowLeft, BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:2rem_2rem]"></div>
      </div>
      <div className="relative z-10">
        <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Mood Dashboard</h1>
          </div>
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </header>
        <main className="p-4 sm:p-6 md:p-8">
          <MoodDashboardClient />
        </main>
      </div>
    </div>
  );
}
