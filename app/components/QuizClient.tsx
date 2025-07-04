"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Question from "./Question";
import Results from "./Results";

import {
  traitsQ1,
  traitsQ4,
  imageFiles,
  modesOfConnection,
  collegeLocations,
  collegeTypes,
  collegeSizes,
  usStates,
} from "@/lib/data";

import {
  shuffleArray,
  calculateResults,
  findCollegeMatches,
  QuizResult,
  College,
  Answers,
} from "@/lib/utils";

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    selected_traits_q1: [],
    selected_single_trait_q2: "",
    least_represented_traits_q3: [],
    selected_traits_q4: [],
    selected_single_trait_q5: "",
    least_represented_traits_q6: [],
    selected_images_q7: [],
    selected_image_q8: "",
    least_represented_images_q9: [],
    selected_modes_q10: [],
    location: "No Preference",
    collegeType: "No Preference",
    collegeSize: "7,501+",
    state: "Iowa",
    full_name: "",
    email: "",
  });

  const [shuffledData, setShuffledData] = useState({
    traitsQ1: [] as string[],
    traitsQ4: [] as string[],
    imageFiles: [] as string[],
    modesOfConnection: [] as string[],
  });

  const [result, setResult] = useState<QuizResult | null>(null);
  const [collegeMatches, setCollegeMatches] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShuffledData({
      traitsQ1: shuffleArray([...traitsQ1]),
      traitsQ4: shuffleArray([...traitsQ4]),
      imageFiles: shuffleArray([...imageFiles]),
      modesOfConnection: shuffleArray([...modesOfConnection]),
    });
  }, []);

  const handleSelect = (key: keyof Answers, val: string, max: number) => {
    setAnswers((prev) => {
      const currentSelection = (prev[key] as string[]) || [];
      const newSelection = currentSelection.includes(val)
        ? currentSelection.filter((item) => item !== val)
        : [...currentSelection, val];

      if (newSelection.length > max) return prev;
      return { ...prev, [key]: newSelection };
    });
  };

  const handleSingle = (key: keyof Answers, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const nextStep = () => setCurrentStep((s) => s + 1);
  const prevStep = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const quizResult = calculateResults(answers);

    if (quizResult) {
      setResult(quizResult);
      const matches = await findCollegeMatches(answers);
      setCollegeMatches(matches);

      // Send submission to API
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: answers.full_name,
          email: answers.email,
          personaName: quizResult.persona.name,
          state: answers.state,
          // Add more fields as needed
        }),
      });
    }

    setIsLoading(false);
    nextStep();
  };

  const remQ3 = shuffledData.traitsQ1.filter(
    (t) => !answers.selected_traits_q1.includes(t)
  );
  const remQ6 = shuffledData.traitsQ4.filter(
    (t) => !answers.selected_traits_q4.includes(t)
  );
  const remQ9 = shuffledData.imageFiles.filter(
    (i) => !answers.selected_images_q7.includes(i)
  );

  const questions = [
    { key: "selected_traits_q1", title: "Select 3 traits that best represent you.", type: "checkbox", options: shuffledData.traitsQ1, max: 3 },
    { key: "selected_single_trait_q2", title: "Which of those 3 is most like you?", type: "radio", options: answers.selected_traits_q1 },
    { key: "least_represented_traits_q3", title: "Select 3 traits that least represent you.", type: "checkbox", options: remQ3, max: 3 },
    { key: "selected_traits_q4", title: "Select 3 new traits.", type: "checkbox", options: shuffledData.traitsQ4, max: 3 },
    { key: "selected_single_trait_q5", title: "Which of those 3 is most like you?", type: "radio", options: answers.selected_traits_q4 },
    { key: "least_represented_traits_q6", title: "Select 3 traits that least represent you.", type: "checkbox", options: remQ6, max: 3 },
    { key: "selected_images_q7", title: "Select 3 icons that best represent you.", type: "image-checkbox", options: shuffledData.imageFiles, max: 3 },
    { key: "selected_image_q8", title: "Which of those 3 is most like you?", type: "image-radio", options: answers.selected_images_q7 },
    { key: "least_represented_images_q9", title: "Select 3 icons that least represent you.", type: "image-checkbox", options: remQ9, max: 3 },
    { key: "selected_modes_q10", title: "Which two 'Modes of Connection'?", type: "checkbox", options: shuffledData.modesOfConnection, max: 2 },
    { key: "location", title: "Where would you like to attend college?", type: "radio", options: collegeLocations },
    { key: "state", title: "What is your primary state of residence?", type: "select", options: usStates },
    { key: "collegeType", title: "What type of college?", type: "radio", options: collegeTypes },
    { key: "collegeSize", title: "What college size?", type: "radio", options: collegeSizes },
    { key: "full_name", title: "Your Full Name", type: "text" },
    { key: "email", title: "Your Email Address", type: "email" },
  ];

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  if (result) {
    return <Results result={result} collegeMatches={collegeMatches} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion && (
            <Question
              question={currentQuestion}
              value={answers[currentQuestion.key as keyof Answers]}
              onCheckboxChange={(v) => handleSelect(currentQuestion.key as keyof Answers, v, currentQuestion.max || 1)}
              onRadioChange={(v) => handleSingle(currentQuestion.key as keyof Answers, v)}
              onTextChange={(v) => handleSingle(currentQuestion.key as keyof Answers, v)}
              onSelectChange={(v) => handleSingle(currentQuestion.key as keyof Answers, v)}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !answers.full_name || !answers.email}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Calculating..." : "See My Results"}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}