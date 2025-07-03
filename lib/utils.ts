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

interface CollegeRecord {
  name: string;
  website: string;
  state: string;
  type: string;
  population: string;
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
  scores: { [color: string]: number };
}

// --- UTILITY FUNCTIONS ---

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateResults(answers: Answers): QuizResult | null {
  const scoreCounter: { [color: string]: number } = {};

  Object.values(motivatorCategories)
    .flat()
    .forEach((color) => {
      scoreCounter[color] = 0;
    });

  answers.selected_traits_q1.forEach(
    (trait: string) => scoreCounter[traitScoreMap[trait]]++
  );
  scoreCounter[traitScoreMap[answers.selected_single_trait_q2]]++;
  answers.least_represented_traits_q3.forEach(
    (trait: string) => scoreCounter[traitScoreMap[trait]]--
  );
  answers.selected_traits_q4.forEach(
    (trait: string) => scoreCounter[traitScoreMap[trait]]++
  );
  scoreCounter[traitScoreMap[answers.selected_single_trait_q5]]++;
  answers.least_represented_traits_q6.forEach(
    (trait: string) => scoreCounter[traitScoreMap[trait]]--
  );
  answers.selected_images_q7.forEach(
    (image: string) => scoreCounter[imageScoreMap[image]]++
  );
  scoreCounter[imageScoreMap[answers.selected_image_q8]]++;
  answers.least_represented_images_q9.forEach(
    (image: string) => scoreCounter[imageScoreMap[image]]--
  );
  answers.selected_modes_q10.forEach(
    (mode: string) => scoreCounter[traitScoreMap[mode]]++
  );

  const motivatorScores = {
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

  const sortedMotivators = Object.entries(motivatorScores).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    if (
      a[0] === "Vitality Motivator" &&
      (b[0] === "Strength Motivator" || b[0] === "Creativity Motivator")
    )
      return -1;
    if (
      b[0] === "Vitality Motivator" &&
      (a[0] === "Strength Motivator" || a[0] === "Creativity Motivator")
    )
      return 1;
    if (a[0] === "Strength Motivator" && b[0] === "Creativity Motivator")
      return -1;
    if (b[0] === "Strength Motivator" && a[0] === "Creativity Motivator")
      return 1;
    return 0;
  });

  const winner = sortedMotivators[0][0];

  const topTwoColors = Object.entries(scoreCounter)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map((entry) => entry[0]);

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
    winner,
    persona,
    scores: scoreCounter,
  };
}

/**
 * Finds college matches from a local JSON file based on filters.
 * @param filters The user's filtering preferences.
 */
export async function findCollegeMatches(filters: {
  location: string;
  collegeType: string;
  collegeSize: string;
  state: string;
}): Promise<College[]> {
  try {
    // Start with the full list of colleges
    let collegePool: CollegeRecord[] = collegesData as CollegeRecord[];

    // **CORRECTED FILTERING LOGIC**
    // 1. Filter by State (if "in-state" is chosen)
    if (filters.location === "in-state" && filters.state) {
      collegePool = collegePool.filter(
        (college) => college.state === filters.state
      );
    }

    // Create a fallback pool in case the next filters yield no results
    const stateFallbackPool = [...collegePool];

    // 2. Filter by College Type
    if (filters.collegeType && filters.collegeType !== "No Preference") {
      const filtered = collegePool.filter(
        (college) => college.type === filters.collegeType
      );
      // Only apply this filter if it doesn't result in an empty list
      if (filtered.length > 0) {
        collegePool = filtered;
      }
    }

    // 3. Filter by College Size
    if (filters.collegeSize) {
      const sizeRanges: { [key: string]: { min: number; max: number } } = {
        "2,500 or less": { min: 0, max: 2500 },
        "2,501-7,500": { min: 2501, max: 7500 },
        "7,501+": { min: 7501, max: Infinity },
      };
      const range = sizeRanges[filters.collegeSize];
      if (range) {
        const filtered = collegePool.filter((college) => {
          if (college.population === undefined) return false;
          const population = parseInt(college.population, 10);
          return (
            !isNaN(population) &&
            population >= range.min &&
            population <= range.max
          );
        });
        // Only apply this filter if it doesn't result in an empty list
        if (filtered.length > 0) {
          collegePool = filtered;
        }
      }
    }

    // Fallback: If the pool is empty after all filters, use the state-only pool
    if (collegePool.length === 0 && filters.location === 'in-state') {
        collegePool = stateFallbackPool;
    }
    
    // Final check: if the pool is still empty, there are no matches at all
    if (collegePool.length === 0) {
        return [];
    }

    const shuffled = shuffleArray(collegePool);
    const selectionCount = Math.floor(Math.random() * 3) + 3;

    // Slice to a maximum of the pool's length to avoid errors
    const finalSelectionCount = Math.min(selectionCount, shuffled.length);

    return shuffled.slice(0, finalSelectionCount).map((college) => ({
      name: college.name,
      url: college.website,
    }));
  } catch (error) {
    console.error("Error finding college matches:", error);
    return [];
  }
}