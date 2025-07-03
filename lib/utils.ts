import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// FIX 1: Corrected path to the data file in the /lib directory.
// Using the '@/' alias is a best practice and assumes it's configured to point to your project root.
import {
  traitScoreMap,
  imageScoreMap,
  motivatorCategories,
  personaMap,
} from "@/lib/data";

// FIX 2: Corrected path to the JSON file after moving it to the /lib directory.
import collegesData from "@/lib/us-colleges-and-universities.json";

// --- TYPE DEFINITIONS ---

// Matches the flat JSON structure, with population as a number
interface CollegeRecord {
  name: string;
  website: string;
  state: string;
  type: string;
  population: number;
}

export interface Answers {
  selected_traits_q1: string[];
  selected_single_trait_q2: string;
  least_represented_traits_q3: string[];
  selected_traits_q4: string[];
  selected_single_trait_q5: string;
  least_represented_traits_q6: string[];
  selected_images_q7: string[];
  selected_image_q8: string;
  least_represented_images_q9: string[];
  selected_modes_q10: string[];
  location: string;
  collegeType: string;
  collegeSize: string;
  state: string;
}

export interface College {
  name: string;
  url: string;
}

export interface QuizResult {
  winner: string;
  persona: { name: string; description: string };
  scores: Record<string, number>;
  motivators: Record<string, number>;
}

// --- UTILITY FUNCTIONS ---

/**
 * Shuffles an array in place and returns it.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * A utility function for combining Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the personality results, including motivators, based on user answers.
 */
export function calculateResults(answers: Answers): QuizResult {
  // Initialize color scores
  const colorScores: Record<string, number> = {};
  Object.values(motivatorCategories)
    .flat()
    .forEach((color) => {
      colorScores[color] = 0;
    });

  // Tally trait rounds
  answers.selected_traits_q1.forEach((t) => colorScores[traitScoreMap[t]]++);
  colorScores[traitScoreMap[answers.selected_single_trait_q2]]++;
  answers.least_represented_traits_q3.forEach(
    (t) => colorScores[traitScoreMap[t]]--
  );
  answers.selected_traits_q4.forEach((t) => colorScores[traitScoreMap[t]]++);
  colorScores[traitScoreMap[answers.selected_single_trait_q5]]++;
  answers.least_represented_traits_q6.forEach(
    (t) => colorScores[traitScoreMap[t]]--
  );

  // Tally image rounds
  answers.selected_images_q7.forEach((img) => colorScores[imageScoreMap[img]]++);
  colorScores[imageScoreMap[answers.selected_image_q8]]++;
  answers.least_represented_images_q9.forEach(
    (img) => colorScores[imageScoreMap[img]]--
  );

  // Modes of connection
  answers.selected_modes_q10.forEach((mode) => colorScores[traitScoreMap[mode]]++);

  // Compute motivator totals
  const motivators: Record<string, number> = {
    "Strength Motivator": motivatorCategories["Strength Motivator"].reduce(
      (sum, c) => sum + colorScores[c],
      0
    ),
    "Vitality Motivator": motivatorCategories["Vitality Motivator"].reduce(
      (sum, c) => sum + colorScores[c],
      0
    ),
    "Creativity Motivator": motivatorCategories["Creativity Motivator"].reduce(
      (sum, c) => sum + colorScores[c],
      0
    ),
  };

  // Determine top two color codes for persona key
  const topTwo = Object.entries(colorScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([color]) => color);

  let key = `${topTwo[0]}-${topTwo[1]}`;
  let persona = personaMap[key];
  if (!persona) {
    key = `${topTwo[1]}-${topTwo[0]}`;
    persona = personaMap[key];
  }
  if (!persona) {
    persona = { name: "Unique Combination", description: "" };
  }

  return {
    winner: key,
    persona,
    scores: colorScores,
    motivators,
  };
}

/**
 * Finds college matches based purely on filters.
 */
export async function findCollegeMatches(filters: {
  location: string;
  collegeType: string;
  collegeSize: string;
  state: string;
}): Promise<College[]> {
  // This now directly uses the imported JSON data.
  let pool: CollegeRecord[] = (collegesData as any[]).map((c) => ({
    name: c.name,
    website: c.website,
    state: c.state,
    type: c.type,
    population: Number(c.population),
  }));

  // In-state / out-of-state filter
  if (filters.location === "in-state" && filters.state) {
    pool = pool.filter((c) => c.state === filters.state);
  }

  // Public / Private filter
  if (filters.collegeType !== "No Preference") {
    pool = pool.filter((c) => c.type === filters.collegeType);
  }

  // Size filter
  if (filters.collegeSize) {
    const ranges: Record<string, { min: number; max: number }> = {
      "2,500 or less": { min: 0, max: 2500 },
      "2,501-7,500": { min: 2501, max: 7500 },
      "7,501+": { min: 7501, max: Infinity },
    };
    const range = ranges[filters.collegeSize];
    pool = pool.filter(
      (c) => c.population >= range.min && c.population <= range.max
    );
  }

  // Randomly select 3–5
  const shuffled = shuffleArray(pool);
  const count = Math.floor(Math.random() * 3) + 3;
  return shuffled.slice(0, count).map((c) => ({ name: c.name, url: c.website }));
}