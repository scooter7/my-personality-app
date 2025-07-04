export const traitsQ1 = ["Confident", "Curious", "Determined", "Imaginative", "Poised", "Compassionate", "Enthusiastic", "Bold", "Innovative"];
export const traitsQ4 = ["Influential", "Adventurous", "Tough", "Expressive", "Polished", "Selfless", "Playful", "Independent", "Analytical"];
export const imageFiles = ["OrangeSet.jpg", "BrownSet.jpg", "RedSet.jpg", "YellowSet.jpg", "PurpleSet.jpg", "BlueSet.jpg", "GreenSet.jpg", "PinkSet.jpg", "BlackSet.jpg"];
export const modesOfConnection = ["Achieve With Me", "Explore With Me", "Strive With Me", "Create With Me", "Refine With Me", "Care With Me", "Enjoy With Me", "Defy With Me", "Invent With Me"];
export const affiliations = ["Admitted Student", "Current Student", "Faculty/Staff", "Alum"];
export const collegeLocations = ["In-state", "Out-of-state", "No preference"];
export const collegeTypes = ["Public", "Private", "No Preference"];
export const collegeSizes = ["2,500 or less", "2,501-7,500", "7,501+"];
export const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// --- MOTIVATOR CATEGORIES AND MAPPINGS ---

export const motivatorCategories = {
  "Strength Motivator": ["Silver", "Blue", "Maroon"],
  "Vitality Motivator": ["Pink", "Purple", "Red"],
  "Creativity Motivator": ["Green", "Orange", "Yellow"],
};

// --- MOTIVATOR DESCRIPTIONS ---

export const motivatorDescriptions: { [key: string]: string } = {
  "Creativity Motivator":
    "People with a dominant Creativity Motivator are likely to be creative, adventurous, and transformative. Others will see them as imaginative, inquisitive, and innovative. If a person possesses a significant expression of Creativity, they may be fueled by the act of self-expression, questing toward the unknown, and a need to invent the future.",
  "Strength Motivator":
    "People with a dominant Strength Motivator are likely to be daring, powerful, and resilient. Others will see them as assertive, tenacious, and at times even rebellious. If a person possesses a significant expression of Strength, they may be fueled by the need for growth, a desire to disrupt the norm, or the act of overcoming challenges.",
  "Vitality Motivator":
    "People with a dominant Vitality Motivator are likely to be sophisticated, cheerful, and supportive. Others will see them as refined, enthusiastic, and often even selfless. If a person possesses a significant expression of Vitality, they may be fueled by their many life experiences, the joy of entertaining, and the act of showing others compassion.",
};


// Example trait-to-color mapping (update as needed for your quiz logic)
export const traitScoreMap: { [trait: string]: string } = {
  Confident: "Blue",
  Curious: "Green",
  Determined: "Maroon",
  Imaginative: "Orange",
  Poised: "Pink",
  Compassionate: "Purple",
  Enthusiastic: "Red",
  Bold: "Silver",
  Innovative: "Yellow",
  Influential: "Blue",
  Adventurous: "Green",
  Tough: "Maroon",
  Expressive: "Orange",
  Polished: "Pink",
  Selfless: "Purple",
  Playful: "Red",
  Independent: "Silver",
  Analytical: "Yellow",
  // Add more as needed
  "Achieve With Me": "Blue",
  "Explore With Me": "Green",
  "Strive With Me": "Maroon",
  "Create With Me": "Orange",
  "Refine With Me": "Pink",
  "Care With Me": "Purple",
  "Enjoy With Me": "Red",
  "Defy With Me": "Silver",
  "Invent With Me": "Yellow",
};

// Example image-to-color mapping (update as needed for your quiz logic)
export const imageScoreMap: { [image: string]: string } = {
  "OrangeSet.jpg": "Orange",
  "BrownSet.jpg": "Maroon",
  "RedSet.jpg": "Red",
  "YellowSet.jpg": "Yellow",
  "PurpleSet.jpg": "Purple",
  "BlueSet.jpg": "Blue",
  "GreenSet.jpg": "Green",
  "PinkSet.jpg": "Pink",
  "BlackSet.jpg": "Silver",
};

// Example persona map (update as needed for your quiz logic)
export const personaMap: { [key: string]: { name: string; description: string } } = {
  "Blue-Green": { name: "The Explorer", description: "You are curious and adventurous, always seeking new experiences." },
  "Maroon-Orange": { name: "The Achiever", description: "You are determined and energetic, striving for success." },
  // Add more combinations as needed
};

// --- SCORING AND RESULT CALCULATION ---

/**
 * Calculates the personality motivator result based on color scores.
 * @param colorScores A map of color names to their scores (e.g., { Red: 2, Blue: 1, ... }).
 * @returns An object containing the winning motivator and a description.
 */
export function calculateMotivatorResult(colorScores: { [color: string]: number }): { motivator: string; description: string } {
  const strengthScore = (colorScores["Silver"] || 0) + (colorScores["Blue"] || 0) + (colorScores["Maroon"] || 0);
  const vitalityScore = (colorScores["Pink"] || 0) + (colorScores["Purple"] || 0) + (colorScores["Red"] || 0);
  const creativityScore = (colorScores["Green"] || 0) + (colorScores["Orange"] || 0) + (colorScores["Yellow"] || 0);

  let winner: string;

  const scores = {
    "Vitality Motivator": vitalityScore,
    "Strength Motivator": strengthScore,
    "Creativity Motivator": creativityScore,
  };

  // Find the highest score
  const maxScore = Math.max(vitalityScore, strengthScore, creativityScore);

  // Get all motivators with the highest score
  const winners = Object.keys(scores).filter(
    (key) => scores[key as keyof typeof scores] === maxScore
  ) as (keyof typeof scores)[];

  // Determine the final winner based on tie-breaking rules
  if (winners.length === 1) {
    winner = winners[0];
  } else if (winners.includes("Vitality Motivator")) {
    winner = "Vitality Motivator";
  } else if (winners.includes("Strength Motivator")) {
    winner = "Strength Motivator";
  } else {
    winner = "Creativity Motivator";
  }

  const description = motivatorDescriptions[winner] || "No description available.";

  return {
    motivator: winner,
    description: description,
  };
}