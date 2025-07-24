"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Smile, Meh, Frown, Sparkles, BotMessageSquare, BrainCircuit, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { analyzeUserInput, type AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userInput: z.string().min(10, {
    message: "Please enter at least 10 characters for a meaningful analysis.",
  }),
});

export default function EmotionMentorClient() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUserInputOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeUserInput({ userInput: values.userInput });
      setAnalysisResult(result);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Something went wrong while analyzing your input. Please try again.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <Smile className="h-6 w-6 text-chart-2" />;
      case "Negative":
        return <Frown className="h-6 w-6 text-chart-1" />;
      default:
        return <Meh className="h-6 w-6 text-chart-4" />;
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "text-chart-2";
      case "Negative":
        return "text-chart-1";
      default:
        return "text-chart-4";
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 sm:p-6 md:p-8 bg-background/50">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl border">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Emotion Mentor</CardTitle>
          </div>
          <CardDescription className="text-md">
            Share your thoughts or feelings, and I'll provide you with an emotional insight and a supportive word.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userInput"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me what's on your mind..."
                        className="resize-none min-h-[120px] text-base rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6 rounded-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze My Feelings"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {(isLoading || analysisResult) && <Separator className="my-0" />}
        <CardFooter className="flex flex-col items-start gap-6 p-6">
          {analysisResult && (
            <div className="w-full space-y-8 animate-in fade-in-50 duration-500">
              <div className="space-y-3">
                <h3 className="font-headline text-lg flex items-center gap-2">
                  {getSentimentIcon(analysisResult.sentiment)}
                  Sentiment Analysis
                </h3>
                <p>
                  We've detected an overall <strong className={`font-bold ${getSentimentTextColor(analysisResult.sentiment)}`}>{analysisResult.sentiment.toLowerCase()} sentiment</strong>.
                </p>
                <p className="text-sm text-muted-foreground">{analysisResult.explanation}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-headline text-lg flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Psychological Tones
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.psychologicalTones.split(',').map(tone => tone.trim()).map((tone, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3 rounded-md">{tone}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-headline text-lg flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-primary" />
                  A Comforting Word for You
                </h3>
                <blockquote className="p-4 bg-accent/50 rounded-lg border-l-4 border-accent">
                  <p className="italic text-accent-foreground/90">
                    {analysisResult.comfortingReply}
                  </p>
                </blockquote>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
