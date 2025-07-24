"use client";

import { useEffect, useState, useMemo } from "react";
import { getMoods, type MoodEntry } from "@/services/mood-service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfWeek } from "date-fns";

const SENTIMENT_COLORS = {
  Positive: "#22c55e",
  Negative: "#ef4444",
  Neutral: "#eab308",
};

const TONE_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", 
  "#00c49f", "#ffbb28", "#ff84s2", "#a4de6c", "#d0ed57"
];

export default function MoodDashboardClient() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const moodData = await getMoods();
        setMoods(moodData);
      } catch (err) {
        setError("Failed to load mood data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toneDistribution = useMemo(() => {
    if (moods.length === 0) return [];
    const toneCounts: { [key: string]: number } = {};
    moods.forEach((mood) => {
      mood.psychologicalTones.split(",").forEach((tone) => {
        const trimmedTone = tone.trim();
        toneCounts[trimmedTone] = (toneCounts[trimmedTone] || 0) + 1;
      });
    });
    return Object.entries(toneCounts).map(([name, value]) => ({ name, value }));
  }, [moods]);

  const weeklySentimentData = useMemo(() => {
    if (moods.length === 0) return [];
    const weekStart = startOfWeek(new Date());
    const weekMoods = moods.filter(mood => mood.createdAt.toDate() >= weekStart);
    
    const sentimentByDay: { [key: string]: { [key: string]: number } } = {};

    for (let i = 6; i >= 0; i--) {
        const day = subDays(new Date(), i);
        const dayName = format(day, "EEE");
        sentimentByDay[dayName] = { Positive: 0, Negative: 0, Neutral: 0 };
    }

    weekMoods.forEach(mood => {
        const dayName = format(mood.createdAt.toDate(), "EEE");
        if(sentimentByDay[dayName]) {
            sentimentByDay[dayName][mood.sentiment] = (sentimentByDay[dayName][mood.sentiment] || 0) + 1;
        }
    });

    return Object.keys(sentimentByDay).map(day => ({
        name: day,
        ...sentimentByDay[day]
    }));
  }, [moods]);

  const moodOverTimeData = useMemo(() => {
    if (moods.length === 0) return [];
    const data = moods.map(mood => {
        const sentimentValue = mood.sentiment === 'Positive' ? 1 : mood.sentiment === 'Negative' ? -1 : 0;
        return {
            date: format(mood.createdAt.toDate(), "MMM d"),
            sentiment: sentimentValue,
        };
    }).reverse();
    
    // Simple moving average
    const movingAverage = data.map((_, i, arr) => {
        const start = Math.max(0, i - 2);
        const end = i + 1;
        const subset = arr.slice(start, end);
        const avg = subset.reduce((acc, val) => acc + val.sentiment, 0) / subset.length;
        return { ...arr[i], averageSentiment: avg };
    });

    return movingAverage;
  }, [moods]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (moods.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">No mood data yet!</h2>
        <p className="text-gray-400">
          Use the Emotion Mentor to analyze your feelings, and your mood history will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Mood Over Time</CardTitle>
          <CardDescription>Your sentiment trend for the last entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodOverTimeData}>
              <XAxis dataKey="date" stroke="#888888" />
              <YAxis stroke="#888888" domain={[-1.2, 1.2]} ticks={[-1, 0, 1]} tickFormatter={(val) => val === 1 ? 'Positive' : val === -1 ? 'Negative' : 'Neutral'} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Line type="monotone" dataKey="averageSentiment" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Emotional Tones</CardTitle>
          <CardDescription>Distribution of all detected tones.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toneDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {toneDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TONE_COLORS[index % TONE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3 bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">This Week's Sentiments</CardTitle>
          <CardDescription>A summary of your moods this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklySentimentData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Legend />
              <Bar dataKey="Positive" stackId="a" fill={SENTIMENT_COLORS.Positive} />
              <Bar dataKey="Negative" stackId="a" fill={SENTIMENT_COLORS.Negative} />
              <Bar dataKey="Neutral" stackId="a" fill={SENTIMENT_COLORS.Neutral} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
