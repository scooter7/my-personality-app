"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { QuizResult, College } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { motivatorDescriptions } from "@/lib/data";

interface ResultsProps {
  result: QuizResult;
  collegeMatches: College[];
}

export default function Results({ result, collegeMatches }: ResultsProps) {
  useEffect(() => {
    const submitResults = async () => {
      if (!result) return;

      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // FIX: The 'answers' object is now spread, and 'personaName' is added
          body: JSON.stringify({
            ...result.answers, // Sends all the answers (name, email, state, etc.)
            personaName: result.persona.name, // Adds the persona name
          }),
        });
      } catch (error) {
        console.error("An error occurred during submission:", error);
      }
    };

    submitResults();
  }, [result]);

  const personaDescription =
    result.persona.description || motivatorDescriptions[result.winner] || "Your unique personality profile.";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Your Persona is</h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-2">{result.persona.name}</h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-balance mt-4">
          {personaDescription}
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Your College Matches</h3>
        {collegeMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collegeMatches.map((college) => (
              <a
                key={college.name}
                href={college.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">{college.name}</h4>
                    <p className="text-sm text-blue-500 hover:underline mt-2">Learn More &rarr;</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
             <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-700 dark:text-gray-200">No direct college matches found for your unique persona.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Don't worry! This is a great opportunity to explore a wide range of schools.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}