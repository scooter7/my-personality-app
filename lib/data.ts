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
  "Strength Motivator": ["Blue", "Green", "Maroon"],
  "Vitality Motivator": ["Orange", "Pink", "Yellow"],
  "Creativity Motivator": ["Purple", "Red", "Silver"],
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