"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input";

export interface MoodEntry extends AnalyzeUserInputOutput {
  id: string;
  userInput: string;
  createdAt: Timestamp;
}

export async function saveMood(
  analysis: AnalyzeUserInputOutput,
  userInput: string
): Promise<void> {
  try {
    await addDoc(collection(db, "moods"), {
      ...analysis,
      userInput,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving mood to Firestore: ", error);
    throw new Error("Could not save mood data.");
  }
}

export async function getMoods(): Promise<MoodEntry[]> {
  try {
    const q = query(collection(db, "moods"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const moods: MoodEntry[] = [];
    querySnapshot.forEach((doc) => {
      moods.push({ id: doc.id, ...doc.data() } as MoodEntry);
    });
    return moods;
  } catch (error) {
    console.error("Error fetching moods from Firestore: ", error);
    throw new Error("Could not fetch mood data.");
  }
}
