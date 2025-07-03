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

// Updated interface to match JSON structure (no 'fields' wrapper).
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
  scores: { [color: string]: number };
}

// (Other utility functions like shuffleArray, cn, calculateResults remain unchanged)

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
    // Map the raw JSON data into CollegeRecord[], converting population to number
    let collegePool: CollegeRecord[] = (collegesData as any[]).map((college) => ({
      name: college.name,
      website: college.website,
      state: college.state,
      type: college.type,
      population: Number(college.population), // convert string to number
    }));

    // Filter by State
    if (filters.location === "in-state" && filters.state) {
      collegePool = collegePool.filter(
        (college) => college.state === filters.state
      );
    }

    // Filter by College Type
    if (filters.collegeType && filters.collegeType !== "No Preference") {
      collegePool = collegePool.filter(
        (college) => college.type === filters.collegeType
      );
    }

    // Filter by College Size (using numeric population)
    if (filters.collegeSize) {
      const sizeRanges: { [key: string]: { min: number; max: number } } = {
        "2,500 or less": { min: 0, max: 2500 },
        "2,501-7,500": { min: 2501, max: 7500 },
        "7,501+": { min: 7501, max: Infinity },
      };
      const range = sizeRanges[filters.collegeSize];
      if (range) {
        collegePool = collegePool.filter((college) => {
          const population = college.population;
          return population >= range.min && population <= range.max;
        });
      }
    }

    // Randomly select 3-5 colleges from the filtered pool
    const shuffled = shuffleArray(collegePool);
    const selectionCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 colleges

    return shuffled.slice(0, selectionCount).map((college) => ({
      name: college.name,
      url: college.website,
    }));
  } catch (error) {
    console.error("Error finding college matches:", error);
    return [];
  }
}
