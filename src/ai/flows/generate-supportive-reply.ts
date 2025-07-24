// This is an AI-powered code! Editing it by hand is not recommended.
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a supportive and comforting reply based on the detected tones in the input text.
 *
 * - generateSupportiveReply - A function that generates a supportive reply.
 * - GenerateSupportiveReplyInput - The input type for the generateSupportiveReply function.
 * - GenerateSupportiveReplyOutput - The output type for the generateSupportiveReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportiveReplyInputSchema = z.object({
  sentiment: z
    .string()
    .describe('The overall sentiment of the input text (Positive, Neutral, or Negative).'),
  tones: z.string().describe('A comma-separated list of psychological tones detected in the text.'),
  explanation: z.string().describe('A brief explanation of the emotional insight.'),
  userInput: z.string().describe('The original user input text.'),
});
export type GenerateSupportiveReplyInput = z.infer<typeof GenerateSupportiveReplyInputSchema>;

const GenerateSupportiveReplyOutputSchema = z.object({
  reply: z.string().describe('A comforting and supportive reply that fits the user input and tone.'),
});
export type GenerateSupportiveReplyOutput = z.infer<typeof GenerateSupportiveReplyOutputSchema>;

export async function generateSupportiveReply(
  input: GenerateSupportiveReplyInput
): Promise<GenerateSupportiveReplyOutput> {
  return generateSupportiveReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupportiveReplyPrompt',
  input: {schema: GenerateSupportiveReplyInputSchema},
  output: {schema: GenerateSupportiveReplyOutputSchema},
  prompt: `You are an AI assistant designed to offer emotional support. Generate a comforting and supportive reply based on the sentiment, psychological tones, and explanation of the user's input.

Sentiment: {{{sentiment}}}
Tones: {{{tones}}}
Explanation: {{{explanation}}}
User Input: {{{userInput}}}

Comforting Reply:`,
});

const generateSupportiveReplyFlow = ai.defineFlow(
  {
    name: 'generateSupportiveReplyFlow',
    inputSchema: GenerateSupportiveReplyInputSchema,
    outputSchema: GenerateSupportiveReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {reply: output!.reply};
  }
);
