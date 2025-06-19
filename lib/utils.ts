import {
  traitScoreMap,
  imageScoreMap,
  colorPriority,
  personaMap,
} from "./data";

// --- TYPE DEFINITIONS ---

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
}

export interface College {
  name: string;
  url: string;
  topColor: string;
  topSupportingColor: string;
  additionalSupportingColor: string;
}

export interface QuizResult {
  topTwoColors: string[];
  persona: { name: string; description: string; };
  scores: { [color: string]: number };
}

// --- UTILITY FUNCTIONS ---

/**
 * Shuffles an array in place and returns it.
 * @param array The array to shuffle.
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Calculates the personality results based on user answers.
 * @param answers The user's selections from the quiz.
 */
export function calculateResults(answers: Answers): QuizResult | null {
  const scoreCounter: { [color: string]: number } = {};
  colorPriority.forEach(color => {
    scoreCounter[color] = 3;
  });

  // Q1 & Q2: Add points for selected traits
  answers.selected_traits_q1.forEach((trait: string) => scoreCounter[traitScoreMap[trait]]++);
  scoreCounter[traitScoreMap[answers.selected_single_trait_q2]]++;

  // Q3: Subtract points for least represented traits
  answers.least_represented_traits_q3.forEach((trait: string) => scoreCounter[traitScoreMap[trait]]--);
  
  // Q4 & Q5: Add points
  answers.selected_traits_q4.forEach((trait: string) => scoreCounter[traitScoreMap[trait]]++);
  scoreCounter[traitScoreMap[answers.selected_single_trait_q5]]++;

  // Q6: Subtract points
  answers.least_represented_traits_q6.forEach((trait: string) => scoreCounter[traitScoreMap[trait]]--);

  // Q7 & Q8: Add points for images
  answers.selected_images_q7.forEach((image: string) => scoreCounter[imageScoreMap[image]]++);
  scoreCounter[imageScoreMap[answers.selected_image_q8]]++;
  
  // Q9: Subtract points for images
  answers.least_represented_images_q9.forEach((image: string) => scoreCounter[imageScoreMap[image]]--);
  
  // Q10: Add points for modes
  answers.selected_modes_q10.forEach((mode: string) => scoreCounter[traitScoreMap[mode]]++);

  // Sort scores: 1st by score (desc), 2nd by colorPriority index (asc)
  const sortedScores = Object.entries(scoreCounter).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return colorPriority.indexOf(a[0]) - colorPriority.indexOf(b[0]);
  });
  
  if (sortedScores.length < 2) return null;

  const topTwoColors = [sortedScores[0][0], sortedScores[1][0]];
  
  // Look up persona using both Primary-Secondary and Secondary-Primary combinations
  let personaKey = `${topTwoColors[0]}-${topTwoColors[1]}`;
  let persona = personaMap[personaKey];
  
  if (!persona) {
    personaKey = `${topTwoColors[1]}-${topTwoColors[0]}`;
    persona = personaMap[personaKey];
  }

  // Fallback if no persona is found
  if (!persona) {
    persona = { name: "Unique Combination", description: "Your unique combination of colors creates a special personality." };
  }

  return {
    topTwoColors,
    persona,
    scores: scoreCounter,
  };
}

/**
 * Fetches college data and finds matches based on personality colors.
 * @param primaryColor The user's primary personality color.
 * @param secondaryColor The user's secondary personality color.
 */
export async function findCollegeMatches(primaryColor: string, secondaryColor: string): Promise<College[]> {
  try {
    // In Next.js, files in the `public` directory are served at the root.
    const response = await fetch('/colleges.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch colleges.json: ${response.statusText}`);
    }
    const colleges: College[] = await response.json();

    const matches = colleges.filter(college => {
      // Prioritize direct matches but also allow for swapped color roles
      const directMatch = college.topColor === primaryColor && college.topSupportingColor === secondaryColor;
      const swappedMatch = college.topColor === secondaryColor && college.topSupportingColor === primaryColor;
      return directMatch || swappedMatch;
    });

    return matches;
  } catch (error) {
    console.error("Error finding college matches:", error);
    return []; // Return an empty array on error
  }
}