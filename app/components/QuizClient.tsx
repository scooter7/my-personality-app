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
type Answers = { [key: string]: string | string[] };

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    q1: [], q3: [], q4: [], q6: [], q7: [], q9: [], q10: [],
    location: "No preference",
    collegeType: "No Preference",
    collegeSize: "",
    state: "",
    fullName: "",
    email: "",
    affiliation: "",
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

  const handleSelect = (key: string, val: string, max: number) => {
    setAnswers(prev => {
      const curr = (prev[key] as string[]) || [];
      const next = curr.includes(val) ? curr.filter(x => x !== val) : [...curr, val];
      if (next.length > max) return prev;
      return { ...prev, [key]: next };
    });
  };
  const handleSingle = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const nextStep = () => setCurrentStep(s => s + 1);
  const prevStep = () => setCurrentStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const qr = calculateResults({
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
    if (qr) {
      // Determine motivator persona
      const s = qr.scores;
      const strength = (s.Silver||0)+(s.Blue||0)+(s.Maroon||0);
      const vitality = (s.Pink||0)+(s.Purple||0)+(s.Red||0);
      const creativity = (s.Green||0)+(s.Orange||0)+(s.Yellow||0);
      let personaLabel: string;
      if (vitality >= strength && vitality >= creativity) personaLabel = "Vitality Motivator";
      else if (strength >= creativity) personaLabel = "Strength Motivator";
      else personaLabel = "Creativity Motivator";
      qr.persona = { name: personaLabel, description: "" };
      setResult(qr);

      // Fetch colleges by filters only
      const matches = await findCollegeMatches({
        location: answers.location as string,
        collegeType: answers.collegeType as string,
        collegeSize: answers.collegeSize as string,
        state: answers.state as string,
      });
      setCollegeMatches(matches);

      setIsSubmitting(true);
      try {
        await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          fullName: answers.fullName,
          email: answers.email,
          affiliation: answers.affiliation,
          state: answers.state,
          personaName: personaLabel
        })});
      } catch(e){console.error(e);} finally {setIsSubmitting(false);}
    }
    setIsLoading(false);
    nextStep();
  };

  // Remaining options
  const remQ3 = shuffledData.traitsQ1.filter(t=>!(answers.q1 as string[]).includes(t));
  const remQ6 = shuffledData.traitsQ4.filter(t=>!(answers.q4 as string[]).includes(t));
  const remQ9 = shuffledData.imageFiles.filter(i=>!(answers.q7 as string[]).includes(i));

  const questions = [
    { key:'q1',title:'Select 3 traits that best represent you.',type:'checkbox',options:shuffledData.traitsQ1,max:3 },
    { key:'q2',title:'Which of those 3 is most like you?',type:'radio',options:answers.q1 as string[] },
    { key:'q3',title:'Select 3 traits that least represent you.',type:'checkbox',options:remQ3,max:3 },
    { key:'q4',title:'Select 3 new traits.',type:'checkbox',options:shuffledData.traitsQ4,max:3 },
    { key:'q5',title:'Which of those 3 is most like you?',type:'radio',options:answers.q4 as string[] },
    { key:'q6',title:'Select 3 traits that least represent you.',type:'checkbox',options:remQ6,max:3 },
    { key:'q7',title:'Select 3 icons that best represent you.',type:'image-checkbox',options:shuffledData.imageFiles,max:3 },
    { key:'q8',title:'Which of those 3 is most like you?',type:'image-radio',options:answers.q7 as string[] },
    { key:'q9',title:'Select 3 icons that least represent you.',type:'image-checkbox',options:remQ9,max:3 },
    { key:'q10',title:"Which two 'Modes of Connection'?",type:'checkbox',options:shuffledData.modesOfConnection,max:2 },
    { key:'location',title:'Where would you like to attend college?',type:'radio',options:collegeLocations },
    { key:'collegeType',title:'What type of college?',type:'radio',options:collegeTypes },
    { key:'collegeSize',title:'What college size?',type:'radio',options:collegeSizes },
    { key:'fullName',title:'Full Name',type:'text' },
    { key:'email',title:'Email',type:'email' },
    { key:'affiliation',title:'Affiliation',type:'select',options:affiliations },
    { key:'state',title:'State',type:'select',options:usStates },
  ];

  if (result) return <Results result={result} collegeMatches={collegeMatches} />;

  const cq = questions[currentStep];
  const isLast = currentStep === questions.length -1;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-50}} transition={{ duration:0.3 }}>
          {cq && <Question question={cq} value={answers[cq.key]} onCheckboxChange={(v)=>handleSelect(cq.key,v,cq.max||1)} onRadioChange={(v)=>handleSingle(cq.key,v)} onTextChange={(v)=>handleSingle(cq.key,v)} onSelectChange={(v)=>handleSingle(cq.key,v)} />}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-between">
        <button onClick={prevStep} disabled={currentStep===0} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50">Back</button>
        {isLast ?
          <button onClick={handleSubmit} disabled={isLoading||isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading?"Calculating...": isSubmitting?"Submitting...":"Submit"}
          </button>
        :
          <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
        }
      </div>
    </div>
  );
}
