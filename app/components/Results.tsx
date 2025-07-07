"use client";

import { useEffect } from "react";
import { QuizResult, College } from "@/lib/utils";
import { motivatorDescriptions } from "@/lib/data";

interface ResultsProps {
  result: QuizResult;
  collegeMatches: College[];
}

export default function Results({ result, collegeMatches }: ResultsProps) {
  useEffect(() => {
    const submitResults = async () => {
      if (!result) return; // Add a guard clause

      try {
        console.log("Submitting answers:", result.answers); // For debugging
        
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // FIX: Changed 'results.answers' to 'result.answers'
          body: JSON.stringify({ answers: result.answers }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to submit results:", errorData.error);
        } else {
          console.log("Results submitted successfully!");
        }
      } catch (error) {
        console.error("An error occurred during submission:", error);
      }
    };

    submitResults();
  // FIX: Changed dependency from 'results' to 'result'
  }, [result]);

  const personaDescription =
    result.persona.description || motivatorDescriptions[result.winner];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
      <h1 className="text-4xl font-bold text-cx-dark-blue mb-4">
        Your Results
      </h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-cx-green mb-2">
          Your Persona: {result.persona.name}
        </h2>
        <p className="text-lg text-cx-text">{personaDescription}</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-cx-green mb-2">
          Your Motivator: {result.winner}
        </h2>
      </div>

      {collegeMatches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-cx-green mb-4">
            Here are some colleges that might be a good fit for you:
          </h2>
          <ul className="text-left list-none p-0">
            {collegeMatches.map((college, index) => (
              <li
                key={index}
                className="mb-2 text-lg text-cx-dark-blue hover:text-cx-green"
              >
                <a
                  href={college.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold"
                >
                  {college.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}