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
  prompt: `You are a supportive and emotionally intelligent AI assistant.

When a user shares a message, perform the following:
1. Determine the **Overall Sentiment**: Positive, Neutral, or Negative.
2. Identify the **Emotional Tones** present in the message (e.g., joy, sadness, anger, fear, anxiety, hope, loneliness, etc.).
3. Provide a **brief explanation** for why you detected these tones.
4. Write a **comforting and uplifting message** in response, as if you're gently encouraging the user like a supportive friend.

Respond strictly in this format:

Sentiment: <Positive / Neutral / Negative>
Emotional Tones: <Tone1, Tone2, ...>
Explanation: <Brief reason for detected emotion>
Comforting Message: <Friendly and warm message that fits the user’s emotional state>

Now analyze this message:
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
