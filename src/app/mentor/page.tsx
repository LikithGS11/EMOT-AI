import EmotionMentorClient from '@/components/emotion-mentor/emotion-mentor-client';

export default function MentorPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:2rem_2rem]"></div>
      </div>
      <main className="relative z-10 w-full">
        <EmotionMentorClient />
      </main>
    </div>
  );
}
