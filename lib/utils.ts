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
  affiliations,
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
} from "@/lib/utils";

// Define the structure for all answers
type Answers = {
  [key: string]: string | string[];
};

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    q1: [],
    q3: [],
    q4: [],
    q6: [],
    q7: [],
    q9: [],
    q10: [],
    location: "No preference",
    collegeType: "No Preference",
    collegeSize: "",
    state: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle once on mount
  useEffect(() => {
    setShuffledData({
      traitsQ1: shuffleArray([...traitsQ1]),
      traitsQ4: shuffleArray([...traitsQ4]),
      imageFiles: shuffleArray([...imageFiles]),
      modesOfConnection: shuffleArray([...modesOfConnection]),
    });
  }, []);

  const handleSelect = (
    questionKey: string,
    value: string,
    maxSelections: number
  ) => {
    setAnswers((prev) => {
      const current = (prev[questionKey] as string[]) || [];
      const newSel = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (newSel.length > maxSelections) return prev;
      return { ...prev, [questionKey]: newSel };
    });
  };

  const handleSingleSelect = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleTextInput = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const nextStep = () => setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => p - 1);

  const handleSubmit = async () => {
    setIsLoading(true);

    // Compute results
    const quizResults = calculateResults({
      selected_traits_q1: answers.q1 as string[],
      selected_single_trait_q2: answers.q2 as string,
      least_represented_traits_q3: answers.q3 as string[],
      selected_traits_q4: answers.q4 as string[],
      selected_single_trait_q5: answers.q5 as string,
      least_represented_traits_q6: answers.q6 as string[],
      selected_images_q7: answers.q7 as string[],
      selected_image_q8: answers.q8 as string,
      least_represented_images_q9: answers.q9 as string[],
      selected_modes_q10: answers.q10 as string[],
      location: answers.location as string,
      collegeType: answers.collegeType as string,
      collegeSize: answers.collegeSize as string,
      state: answers.state as string,
    });

    if (quizResults) {
      // Override persona to be one of the three motivators
      const scores = quizResults.scores;
      const strengthTotal =
        (scores["Silver"] || 0) +
        (scores["Blue"] || 0) +
        (scores["Maroon"] || 0);
      const vitalityTotal =
        (scores["Pink"] || 0) +
        (scores["Purple"] || 0) +
        (scores["Red"] || 0);
      const creativityTotal =
        (scores["Green"] || 0) +
        (scores["Orange"] || 0) +
        (scores["Yellow"] || 0);

      let personaLabel: string;
      // Vitality wins ties, then strength beats creativity
      if (vitalityTotal >= strengthTotal && vitalityTotal >= creativityTotal) {
        personaLabel = "Vitality Motivator";
      } else if (strengthTotal >= creativityTotal) {
        personaLabel = "Strength Motivator";
      } else {
        personaLabel = "Creativity Motivator";
      }

      // Update result persona
      quizResults.persona = { name: personaLabel, description: "" };
      setResult(quizResults);

      // Fetch college matches solely by filters
      const matches = await findCollegeMatches({
        location: answers.location as string,
        collegeType: answers.collegeType as string,
        collegeSize: answers.collegeSize as string,
        state: answers.state as string,
      });
      setCollegeMatches(matches);

      // Optionally submit to backend
      setIsSubmitting(true);
      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: answers.fullName,
            email: answers.email,
            affiliation: answers.affiliation,
            state: answers.state,
            topTwoColors: [],
            personaName: personaLabel,
          }),
        });
      } catch (err) {
        console.error("Failed to submit results:", err);
      } finally {
        setIsSubmitting(false);
      }
    }

    setIsLoading(false);
    nextStep();
  };

  // Compute remaining options for Q3, Q6, Q9
  const remainingTraitsQ3 = shuffledData.traitsQ1.filter(
    (t) => !(answers.q1 as string[]).includes(t)
  );
  const remainingTraitsQ6 = shuffledData.traitsQ4.filter(
    (t) => !(answers.q4 as string[]).includes(t)
  );
  const remainingImagesQ9 = shuffledData.imageFiles.filter(
    (img) => !(answers.q7 as string[]).includes(img)
  );

  // Question list
  const questions = [
    { key: "q1", title: "Here is a list of 9 traits. Please select exactly 3 that best represent you.", type: "checkbox", options: shuffledData.traitsQ1, max: 3 },
    { key: "q2", title: "Of the 3 traits you selected, which one is most like you?", type: "radio", options: answers.q1 as string[] },
    { key: "q3", title: "Now, select the 3 traits that least represent you.", type: "checkbox", options: remainingTraitsQ3, max: 3 },
    { key: "q4", title: "Here is a new list of 9 traits. Select 3 that best represent you.", type: "checkbox", options: shuffledData.traitsQ4, max: 3 },
    { key: "q5", title: "Of the 3 traits you selected, which one is most like you?", type: "radio", options: answers.q4 as string[] },
    { key: "q6", title: "Now, select the 3 traits that least represent you.", type: "checkbox", options: remainingTraitsQ6, max: 3 },
    { key: "q7", title: "View these 9 icon groups. Select the 3 that best represent you.", type: "image-checkbox", options: shuffledData.imageFiles, max: 3 },
    { key: "q8", title: "Of the 3 icon groups you selected, which one is most like you?", type: "image-radio", options: answers.q7 as string[] },
    { key: "q9", title: "Now, select the 3 icon groups that least represent you.", type: "image-checkbox", options: remainingImagesQ9, max: 3 },
    { key: "q10", title: "Which two 'Modes of Connection' sound most like you?", type: "checkbox", options: shuffledData.modesOfConnection, max: 2 },
    { key: "location", title: "Where would you like to attend college?", type: "radio", options: collegeLocations },
    { key: "collegeType", title: "What type of college would you like to attend?", type: "radio", options: collegeTypes },
    { key: "collegeSize", title: "What size of college is best?", type: "radio", options: collegeSizes },
    { key: "fullName", title: "Full Name", type: "text" },
    { key: "email", title: "Email Address", type: "email" },
    { key: "affiliation", title: "Affiliation", type: "select", options: affiliations },
    { key: "state", title: "State", type: "select", options: usStates },
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
              value={answers[currentQuestion.key]}
              onCheckboxChange={(val) =>
                handleSelect(currentQuestion.key, val, currentQuestion.max || 1)
              }
              onRadioChange={(val) => handleSingleSelect(currentQuestion.key, val)}
              onTextChange={(val) => handleTextInput(currentQuestion.key, val)}
              onSelectChange={(val) => handleSingleSelect(currentQuestion.key, val)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Calculating..." : isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
