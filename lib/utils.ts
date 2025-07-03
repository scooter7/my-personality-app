import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  traitScoreMap,
  imageScoreMap,
  motivatorCategories,
  personaMap,
} from "./data";
import collegesData from "../public/us-colleges-and-universities.json";

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
  location: string;       // "in-state" or "out-of-state"
  collegeType: string;    // e.g., "Public" or "Private" or "No Preference"
  collegeSize: string;    // e.g., "2,500 or less", "2,501-7,500", "7,501+"
  state: string;          // Two-letter state code for in-state filter
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
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
export function calculateResults(answers: Answers): QuizResult | null {
  // Initialize color score counter
  const scoreCounter: Record<string, number> = {};
  Object.values(motivatorCategories)
    .flat()
    .forEach((color) => {
      scoreCounter[color] = 0;
    });

  // Trait rounds
  answers.selected_traits_q1.forEach(
    (trait) => scoreCounter[traitScoreMap[trait]]++
  );
  scoreCounter[traitScoreMap[answers.selected_single_trait_q2]]++;
  answers.least_represented_traits_q3.forEach(
    (trait) => scoreCounter[traitScoreMap[trait]]--
  );

  answers.selected_traits_q4.forEach(
    (trait) => scoreCounter[traitScoreMap[trait]]++
  );
  scoreCounter[traitScoreMap[answers.selected_single_trait_q5]]++;
  answers.least_represented_traits_q6.forEach(
    (trait) => scoreCounter[traitScoreMap[trait]]--
  );

  // Image rounds
  answers.selected_images_q7.forEach(
    (image) => scoreCounter[imageScoreMap[image]]++
  );
  scoreCounter[imageScoreMap[answers.selected_image_q8]]++;
  answers.least_represented_images_q9.forEach(
    (image) => scoreCounter[imageScoreMap[image]]--
  );

  // Modes of connection
  answers.selected_modes_q10.forEach(
    (mode) => scoreCounter[traitScoreMap[mode]]++
  );

  // Compute motivator totals
  const motivatorScores: Record<string, number> = {
    "Strength Motivator": motivatorCategories["Strength Motivator"].reduce(
      (acc, color) => acc + scoreCounter[color],
      0
    ),
    "Vitality Motivator": motivatorCategories["Vitality Motivator"].reduce(
      (acc, color) => acc + scoreCounter[color],
      0
    ),
    "Creativity Motivator": motivatorCategories["Creativity Motivator"].reduce(
      (acc, color) => acc + scoreCounter[color],
      0
    ),
  };

  // Determine persona color combination
  const topTwoColors = Object.entries(scoreCounter)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([color]) => color);

  let personaKey = `${topTwoColors[0]}-${topTwoColors[1]}`;
  let persona = personaMap[personaKey];
  if (!persona) {
    personaKey = `${topTwoColors[1]}-${topTwoColors[0]}`;
    persona = personaMap[personaKey];
  }
  if (!persona) {
    persona = {
      name: "Unique Combination",
      description:
        "Your unique combination of colors creates a special personality.",
    };
  }

  return {
    winner: personaKey,
    persona,
    scores: scoreCounter,
    motivators: motivatorScores,
  };
}

/**
 * Finds college matches purely based on filters: public/private, size, and state location.
 */
export async function findCollegeMatches(
  filters: {
    location: string;
    collegeType: string;
    collegeSize: string;
    state: string;
  }
): Promise<College[]> {
  try {
    // Parse raw JSON into typed records and convert population
    let pool: CollegeRecord[] = (collegesData as any[]).map((c) => ({
      name: c.name,
      website: c.website,
      state: c.state,
      type: c.type,
      population: Number(c.population),
    }));

    // In-state vs out-of-state
    if (filters.location === "in-state" && filters.state) {
      pool = pool.filter((c) => c.state === filters.state);
    }

    // Public/Private
    if (filters.collegeType && filters.collegeType !== "No Preference") {
      pool = pool.filter((c) => c.type === filters.collegeType);
    }

    // Size category
    if (filters.collegeSize) {
      const ranges: Record<string, { min: number; max: number }> = {
        "2,500 or less": { min: 0, max: 2500 },
        "2,501-7,500": { min: 2501, max: 7500 },
        "7,501+": { min: 7501, max: Infinity },
      };
      const range = ranges[filters.collegeSize];
      if (range) {
        pool = pool.filter(
          (c) => c.population >= range.min && c.population <= range.max
        );
      }
    }

    // Randomly pick 3–5 from the filtered pool
    const shuffled = shuffleArray(pool);
    const count = Math.floor(Math.random() * 3) + 3;
    return shuffled.slice(0, count).map((c) => ({ name: c.name, url: c.website }));
  } catch (error) {
    console.error("Error finding college matches:", error);
    return [];
  }
}

// Export all utilities
export { shuffleArray, cn, calculateResults, findCollegeMatches };
