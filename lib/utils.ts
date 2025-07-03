// lib/utils.ts

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
}

// --- UTILITY FUNCTIONS ---

/**
 * Tailwind-friendly className merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Fisher–Yates shuffle.
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
 * Calculate color-based quiz results from the user’s answers.
 */
export function calculateResults(answers: Answers): QuizResult {
  // Initialize all possible colors to zero
  const colorScores: Record<string, number> = {
    Blue: 0,
    Green: 0,
    Maroon: 0,
    Orange: 0,
    Pink: 0,
    Purple: 0,
    Red: 0,
    Silver: 0,
    Yellow: 0,
  };

  // Helper to safely add/subtract
  const adjust = (color: string, delta: number) => {
    if (color in colorScores) colorScores[color] += delta;
  };

  // 1st & 2nd trait rounds
  answers.selected_traits_q1.forEach((t) => adjust(traitScoreMap[t], 1));
  adjust(traitScoreMap[answers.selected_single_trait_q2], 1);
  answers.least_represented_traits_q3.forEach((t) => adjust(traitScoreMap[t], -1));

  answers.selected_traits_q4.forEach((t) => adjust(traitScoreMap[t], 1));
  adjust(traitScoreMap[answers.selected_single_trait_q5], 1);
  answers.least_represented_traits_q6.forEach((t) => adjust(traitScoreMap[t], -1));

  // Image rounds
  answers.selected_images_q7.forEach((img) => adjust(imageScoreMap[img], 1));
  adjust(imageScoreMap[answers.selected_image_q8], 1);
  answers.least_represented_images_q9.forEach((img) => adjust(imageScoreMap[img], -1));

  // Modes of Connection
  answers.selected_modes_q10.forEach((mode) => adjust(traitScoreMap[mode], 1));

  // Determine the top two colors
  const sorted = Object.entries(colorScores)
    .sort(([, a], [, b]) => b - a)
    .map(([color]) => color);
  const [primary, secondary] = sorted;

  // Lookup persona
  const key = `${primary}-${secondary}`;
  const persona = personaMap[key] ?? { name: "Unknown", description: "" };

  return {
    winner: key,
    persona,
    scores: colorScores,
  };
}

/**
 * Filter and randomly pick 3–5 colleges matching the user’s filters.
 */
export async function findCollegeMatches(
  personaName: string,
  filters: {
    location: string;
    collegeType: string;
    collegeSize: string;
    state: string;
  }
): Promise<College[]> {
  try {
    // Convert raw JSON entries into typed records
    let pool: CollegeRecord[] = (collegesData as any[]).map((c) => ({
      name: c.name,
      website: c.website,
      state: c.state,
      type: c.type,
      population: Number(c.population),
    }));

    // In-state filter
    if (filters.location === "in-state" && filters.state) {
      pool = pool.filter((c) => c.state === filters.state);
    }

    // By type
    if (filters.collegeType && filters.collegeType !== "No Preference") {
      pool = pool.filter((c) => c.type === filters.collegeType);
    }

    // By size range
    if (filters.collegeSize) {
      const ranges: Record<string, { min: number; max: number }> = {
        "2,500 or less": { min: 0, max: 2500 },
        "2,501-7,500": { min: 2501, max: 7500 },
        "7,501+": { min: 7501, max: Infinity },
      };
      const r = ranges[filters.collegeSize];
      if (r) {
        pool = pool.filter(
          (c) => c.population >= r.min && c.population <= r.max
        );
      }
    }

    // Pick 3–5 at random
    const shuffled = shuffleArray(pool);
    const count = Math.floor(Math.random() * 3) + 3;
    return shuffled.slice(0, count).map((c) => ({
      name: c.name,
      url: c.website,
    }));
  } catch (err) {
    console.error("Error finding college matches:", err);
    return [];
  }
}
