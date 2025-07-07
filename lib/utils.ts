import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  traitScoreMap,
  imageScoreMap,
  motivatorCategories,
  personaMap,
  motivatorDescriptions,
} from "./data";
import collegesData from "../public/us-colleges-and-universities.json";

// --- DATA MAPPINGS ---

const stateNameToAbbreviation: { [key: string]: string } = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC", "American Samoa": "AS", "Guam": "GU", "Northern Mariana Islands": "MP",
  "Puerto Rico": "PR", "United States Minor Outlying Islands": "UM", "Virgin Islands": "VI",
};

const collegeTypeToCode: { [key: string]: string } = {
  "Public": "1",
  "Private": "2",
};

// --- TYPE DEFINITIONS ---

interface CollegeRecord {
  name: string;
  website: string;
  state: string;
  type: string;
  tot_enroll: string;
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
  full_name: string;
  email: string;
}

export interface College {
  name: string;
  url: string;
}

export interface QuizResult {
  winner: string;
  persona: { name: string; description: string };
  scores: { [color: string]: number };
  answers: Answers; // This line is added
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
  Object.values(motivatorCategories).flat().forEach(color => (scoreCounter[color] = 0));
  answers.selected_traits_q1.forEach(trait => scoreCounter[traitScoreMap[trait]]++);
  if (answers.selected_single_trait_q2) scoreCounter[traitScoreMap[answers.selected_single_trait_q2]]++;
  answers.least_represented_traits_q3.forEach(trait => scoreCounter[traitScoreMap[trait]]--);
  answers.selected_traits_q4.forEach(trait => scoreCounter[traitScoreMap[trait]]++);
  if (answers.selected_single_trait_q5) scoreCounter[traitScoreMap[answers.selected_single_trait_q5]]++;
  answers.least_represented_traits_q6.forEach(trait => scoreCounter[traitScoreMap[trait]]--);
  answers.selected_images_q7.forEach(image => scoreCounter[imageScoreMap[image]]++);
  if (answers.selected_image_q8) scoreCounter[imageScoreMap[answers.selected_image_q8]]++;
  answers.least_represented_images_q9.forEach(image => scoreCounter[imageScoreMap[image]]--);
  answers.selected_modes_q10.forEach(mode => scoreCounter[traitScoreMap[mode]]++);
  const motivatorScores = {
    "Strength Motivator": motivatorCategories["Strength Motivator"].reduce((acc, color) => acc + scoreCounter[color], 0),
    "Vitality Motivator": motivatorCategories["Vitality Motivator"].reduce((acc, color) => acc + scoreCounter[color], 0),
    "Creativity Motivator": motivatorCategories["Creativity Motivator"].reduce((acc, color) => acc + scoreCounter[color], 0)
  };
  const sortedMotivators = Object.entries(motivatorScores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    if (a[0] === "Vitality Motivator") return -1;
    if (b[0] === "Vitality Motivator") return 1;
    if (a[0] === "Strength Motivator" && b[0] === "Creativity Motivator") return -1;
    if (b[0] === "Strength Motivator" && a[0] === "Creativity Motivator") return 1;
    return 0;
  });
  const winner = sortedMotivators[0][0];
  const topTwoColors = Object.entries(scoreCounter).sort(([, a], [, b]) => b - a).slice(0, 2).map(entry => entry[0]);
  let personaKey = `${topTwoColors[0]}-${topTwoColors[1]}`;
  let persona = personaMap[personaKey] || personaMap[`${topTwoColors[1]}-${topTwoColors[0]}`];

  if (!persona) {
    persona = {
      name: winner,
      description: motivatorDescriptions?.[winner] || "Your unique combination of colors creates a special personality."
    };
  }

  // UPDATED: Return the full 'answers' object
  return { winner, persona, scores: scoreCounter, answers };
}

function formatWebsiteUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  return `https://${url}`;
}

function isValidCollegeRecord(college: CollegeRecord): boolean {
  if (!college.name || !college.website) return false;
  if (!/\./.test(college.website)) return false;
  return true;
}

export async function findCollegeMatches(filters: Answers): Promise<College[]> {
  try {
    let collegePool: CollegeRecord[] = collegesData as unknown as CollegeRecord[];

    collegePool = collegePool.filter(isValidCollegeRecord);

    collegePool = collegePool.filter(
      (college) => college.type === "1" || college.type === "2"
    );

    const locationValue = (filters.location || "").toLowerCase();
    let inStatePool: CollegeRecord[] = collegePool;
    let usedInState = false;

    if (locationValue === "in-state" && filters.state) {
      const stateAbbreviation = stateNameToAbbreviation[filters.state as keyof typeof stateNameToAbbreviation];
      if (stateAbbreviation) {
        inStatePool = collegePool.filter(college => college.state === stateAbbreviation);
        collegePool = inStatePool;
        usedInState = true;
      }
    }

    const stateFallbackPool = usedInState ? inStatePool : [...collegePool];

    let filteredPool = collegePool;

    if (filters.collegeType && filters.collegeType !== "No Preference") {
      const typeCode = collegeTypeToCode[filters.collegeType as keyof typeof collegeTypeToCode];
      if (typeCode) {
        const typeFiltered = filteredPool.filter(college => college.type === typeCode);
        if (typeFiltered.length > 0) {
          filteredPool = typeFiltered;
        }
      }
    }

    if (filters.collegeSize && filters.collegeSize !== "No Preference") {
      const sizeRanges = {
        "2,500 or less": { min: 0, max: 2500 },
        "2,501-7,500": { min: 2501, max: 7500 },
        "7,501+": { min: 7501, max: Infinity }
      };
      const range = sizeRanges[filters.collegeSize as keyof typeof sizeRanges];
      if (range) {
        const sizeFiltered = filteredPool.filter(college => {
          const totEnroll = parseInt(college.tot_enroll, 10);
          return !isNaN(totEnroll) && totEnroll >= range.min && totEnroll <= range.max;
        });
        if (sizeFiltered.length > 0) {
          filteredPool = sizeFiltered;
        }
      }
    }

    const finalPool = filteredPool.length > 0
      ? filteredPool
      : (usedInState && stateFallbackPool.length > 0 ? stateFallbackPool : stateFallbackPool);

    if (finalPool.length === 0) {
      console.log("No colleges found after filtering. Check your JSON data and filters.");
    }

    if (finalPool.length === 0) return [];

    const shuffled = shuffleArray(finalPool);
    const selectionCount = Math.floor(Math.random() * 3) + 3;
    const finalSelectionCount = Math.min(selectionCount, shuffled.length);

    return shuffled.slice(0, finalSelectionCount).map((college) => ({
      name: college.name,
      url: "https://www.collegexpress.com/reg/signup",
    }));

  } catch (error) {
    console.error("Error finding college matches:", error);
    return [];
  }
}