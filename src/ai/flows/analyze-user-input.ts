'use server';

/**
 * @fileOverview An AI agent that analyzes user input to detect sentiment and psychological tones, then offers emotional support.
 *
 * - analyzeUserInput - A function that handles the analysis and response generation.
 * - AnalyzeUserInputInput - The input type for the analyzeUserInput function.
 * - AnalyzeUserInputOutput - The return type for the analyzeUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserInputInputSchema = z.object({
  userInput: z.string().describe('The text input from the user.'),
});
export type AnalyzeUserInputInput = z.infer<typeof AnalyzeUserInputInputSchema>;

const AnalyzeUserInputOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']).describe('The overall sentiment of the input text.'),
  psychologicalTones: z.string().describe('A comma-separated list of psychological tones detected in the text.'),
  explanation: z.string().describe('A brief explanation of the emotional insight.'),
  comfortingReply: z.string().describe('A short and warm emotional support message.'),
});
export type AnalyzeUserInputOutput = z.infer<typeof AnalyzeUserInputOutputSchema>;

export async function analyzeUserInput(input: AnalyzeUserInputInput): Promise<AnalyzeUserInputOutput> {
  return analyzeUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserInputPrompt',
  input: {schema: AnalyzeUserInputInputSchema},
  output: {schema: AnalyzeUserInputOutputSchema},
  prompt: `You are an expert AI assistant designed to analyze human emotions from text and offer emotional support.

When a user shares a message, do the following:
1.  Identify and classify the **overall sentiment**: Positive, Neutral, or Negative.
2.  Detect the **psychological tones** (e.g., joy, sadness, fear, anger, hope, anxiety, etc.).
3.  Provide a **brief explanation** for your classification.
4.  Offer a **comforting and supportive reply** that fits the user's tone.

Respond in the following format:

Sentiment: <Positive/Neutral/Negative>
Psychological Tone: <Tone1, Tone2, ...>
Explanation: <Brief explanation of the emotional insight>
Comforting Reply: <Short and warm emotional support message>

Now analyze this input:
"{{{userInput}}}"`,
});

const analyzeUserInputFlow = ai.defineFlow(
  {
    name: 'analyzeUserInputFlow',
    inputSchema: AnalyzeUserInputInputSchema,
    outputSchema: AnalyzeUserInputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
