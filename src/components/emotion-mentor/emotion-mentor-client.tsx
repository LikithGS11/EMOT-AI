"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Smile, Meh, Frown, Sparkles, BrainCircuit, HeartHandshake, PenSquare, Quote, Wind, Music } from "lucide-react";

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
import { generateGuidedSupport, type GenerateGuidedSupportOutput } from "@/ai/flows/generate-guided-support";
import { saveMood } from "@/services/mood-service";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  userInput: z.string().min(10, {
    message: "Please enter at least 10 characters for a meaningful analysis.",
  }),
});

export default function EmotionMentorClient() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUserInputOutput | null>(null);
  const [guidedSupportResult, setGuidedSupportResult] = useState<GenerateGuidedSupportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSupport, setIsLoadingSupport] = useState(false);
  const [showSupportPrompt, setShowSupportPrompt] = useState(false);
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
    setGuidedSupportResult(null);
    setShowSupportPrompt(false);
    try {
      const result = await analyzeUserInput({ userInput: values.userInput });
      setAnalysisResult(result);
      setShowSupportPrompt(true);
      await saveMood(result, values.userInput);
      toast({
        title: "Analysis Saved",
        description: "Your mood entry has been saved to your dashboard.",
      });
    } catch (e) {
      const error = e as Error;
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Something went wrong while analyzing your input. Please try again.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuidedSupport() {
    if (!analysisResult || !form.getValues().userInput) return;
    setIsLoadingSupport(true);
    setShowSupportPrompt(false);
    try {
      const result = await generateGuidedSupport({
        userInput: form.getValues().userInput,
        sentiment: analysisResult.sentiment,
        psychologicalTones: analysisResult.psychologicalTones,
      });
      setGuidedSupportResult(result);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Could not get guided support.",
        description: "Something went wrong while generating support content. Please try again.",
      });
      console.error(e);
    } finally {
      setIsLoadingSupport(false);
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return <Smile className="h-6 w-6 text-green-500" />;
      case "Negative":
        return <Frown className="h-6 w-6 text-red-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "text-green-500";
      case "Negative":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };
  
  const getSentimentBorderColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return "border-green-500/50";
      case "Negative":
        return "border-red-500/50";
      default:
        return "border-yellow-500/50";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4 text-white hover:bg-white/10 hover:text-white">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Card className="w-full shadow-2xl rounded-xl border-gray-800 bg-black/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-headline tracking-tight text-white">Emotion Mentor</CardTitle>
            </div>
            <CardDescription className="text-md text-gray-400">
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
                          className="resize-none min-h-[120px] text-base rounded-lg bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
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
          {(isLoading || analysisResult) && <Separator className="my-0 bg-gray-800" />}
          {analysisResult && (
            <CardFooter className="flex flex-col items-start gap-6 p-6">
              <div className={`w-full space-y-8 animate-in fade-in-50 duration-500 border-t ${getSentimentBorderColor(analysisResult.sentiment)} pt-6`}>
                <div className="space-y-3">
                  <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                    {getSentimentIcon(analysisResult.sentiment)}
                    Sentiment Analysis
                  </h3>
                  <p className="text-lg text-gray-300">
                    We've detected an overall <strong className={`font-bold ${getSentimentTextColor(analysisResult.sentiment)}`}>{analysisResult.sentiment.toLowerCase()} sentiment</strong>.
                  </p>
                  <p className="text-md text-gray-400">{analysisResult.explanation}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    Psychological Tones
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.psychologicalTones.split(',').map(tone => tone.trim()).map((tone, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">{tone}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    A Comforting Word for You
                  </h3>
                  <blockquote className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <p className="italic text-gray-200 text-lg">
                      {analysisResult.comfortingReply}
                    </p>
                  </blockquote>
                </div>

                {showSupportPrompt && (
                   <div className="w-full text-center p-4 bg-gray-900/50 rounded-lg space-y-4 animate-in fade-in-50 duration-500">
                      <p className="text-gray-300">Would you like to explore this further with some guided support?</p>
                      <Button onClick={handleGuidedSupport} disabled={isLoadingSupport}>
                         {isLoadingSupport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Yes, please'}
                      </Button>
                   </div>
                )}
                
                {isLoadingSupport && <div className="flex justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

                {guidedSupportResult && (
                  <div className="w-full space-y-8 animate-in fade-in-50 duration-500">
                    <Separator className="bg-gray-800" />
                    <h2 className="text-2xl font-headline text-white text-center">Guided Support Mode</h2>
                    
                    <div className="space-y-3">
                      <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                        <PenSquare className="h-6 w-6 text-primary" />
                        Journaling Prompt
                      </h3>
                      <blockquote className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-gray-700">
                        <p className="italic text-gray-300">{guidedSupportResult.journalingPrompt}</p>
                      </blockquote>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                        <Quote className="h-6 w-6 text-primary" />
                        Daily Affirmation
                      </h3>
                      <blockquote className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-gray-700">
                        <p className="italic text-gray-300">{guidedSupportResult.affirmation}</p>
                      </blockquote>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                        <Wind className="h-6 w-6 text-primary" />
                        Breathing Exercise: {guidedSupportResult.breathingExercise.name}
                      </h3>
                       <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-gray-700 text-gray-300">
                        <p>{guidedSupportResult.breathingExercise.instructions}</p>
                        <div className="mt-4 w-24 h-24 mx-auto border-4 border-primary rounded-full flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
                          <div className="w-20 h-20 bg-primary/20 rounded-full animate-[pulse_4s_ease-in-out_infinite_reverse]"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-headline text-xl flex items-center gap-2 font-semibold text-white">
                        <Music className="h-6 w-6 text-primary" />
                        Playlist Suggestion
                      </h3>
                       <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-gray-700">
                        <p className="text-gray-300">Consider listening to {guidedSupportResult.playlistSuggestion}.</p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
