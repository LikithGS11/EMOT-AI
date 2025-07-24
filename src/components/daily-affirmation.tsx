"use client";

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const affirmations = [
    "You are capable of amazing things.",
    "Your feelings are valid. Take your time to understand them.",
    "Every day is a new beginning. Take a deep breath and start again.",
    "You are resilient, strong, and brave.",
    "It's okay not to be okay. Be kind to yourself.",
    "You have the power to create the life you desire.",
    "Believe in yourself and all that you are.",
    "You are worthy of love, happiness, and peace."
];

export default function DailyAffirmation() {
    const [affirmation, setAffirmation] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * affirmations.length);
        setAffirmation(affirmations[randomIndex]);
    }, []);

    return (
        <div className="container mx-auto px-6 md:px-10 mt-24">
            <div className="text-center p-8 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <Quote className="h-6 w-6 text-primary" />
                    Daily Affirmation
                </h3>
                {affirmation ? (
                    <p className="text-xl italic text-gray-300">
                        "{affirmation}"
                    </p>
                ) : (
                     <div className="h-7 bg-gray-700 rounded-md w-3/4 mx-auto animate-pulse"></div>
                )}
            </div>
        </div>
    );
}
