'use server';

/**
 * @fileOverview A Genkit flow that generates guided support content based on emotional analysis.
 *
 * - generateGuidedSupport - Generates journaling prompts, affirmations, and other supportive content.
 * - GenerateGuidedSupportInput - The input type for the generateGuidedSupport function.
 * - GenerateGuidedSupportOutput - The return type for the generateGuidedSupport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateGuidedSupportInputSchema = z.object({
  userInput: z.string().describe('The original text input from the user.'),
  sentiment: z.string().describe('The detected sentiment (e.g., Positive, Negative, Neutral).'),
  psychologicalTones: z.string().describe('The detected psychological tones (e.g., sadness, anxiety).'),
});
export type GenerateGuidedSupportInput = z.infer<typeof GenerateGuidedSupportInputSchema>;

export const GenerateGuidedSupportOutputSchema = z.object({
  journalingPrompt: z.string().describe('A reflective journaling prompt related to the user\'s feelings.'),
  affirmation: z.string().describe('A positive affirmation to uplift the user.'),
  breathingExercise: z.object({
    name: z.string().describe('The name of the breathing exercise.'),
    instructions: z.string().describe('Simple instructions for the breathing exercise.'),
  }),
  playlistSuggestion: z.string().describe('A suggestion for a type of music playlist (e.g., "a calming instrumental playlist", "an upbeat pop playlist").'),
});
export type GenerateGuidedSupportOutput = z.infer<typeof GenerateGuidedSupportOutputSchema>;

export async function generateGuidedSupport(input: GenerateGuidedSupportInput): Promise<GenerateGuidedSupportOutput> {
  return generateGuidedSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGuidedSupportPrompt',
  input: { schema: GenerateGuidedSupportInputSchema },
  output: { schema: GenerateGuidedSupportOutputSchema },
  prompt: `You are a compassionate and supportive AI assistant. Based on the user's message and its emotional analysis, generate a set of guided support resources.

User's situation:
- User Input: "{{{userInput}}}"
- Sentiment: {{{sentiment}}}
- Tones: {{{psychologicalTones}}}

Generate the following, tailored to the user's emotional state:
1.  **Journaling Prompt**: A thoughtful question to encourage deeper reflection.
2.  **Affirmation**: A short, positive statement the user can repeat.
3.  **Breathing Exercise**: A simple, calming breathing technique. Provide a name and brief instructions.
4.  **Playlist Suggestion**: A genre or mood of music that would be fitting.

Your response must be in the structured format defined by the output schema.`,
});

const generateGuidedSupportFlow = ai.defineFlow(
  {
    name: 'generateGuidedSupportFlow',
    inputSchema: GenerateGuidedSupportInputSchema,
    outputSchema: GenerateGuidedSupportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
