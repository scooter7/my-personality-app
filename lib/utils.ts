// lib/utils.ts

/**
 * Fetches college data and finds matches based on a tiered system.
 * @param primaryColor The user's primary personality color.
 * @param secondaryColor The user's secondary personality color.
 */
export async function findCollegeMatches(primaryColor: string, secondaryColor: string): Promise<College[]> {
  try {
    const response = await fetch('/colleges.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch colleges.json: ${response.statusText}`);
    }
    const colleges: College[] = await response.json();

    const perfectMatches: College[] = [];
    const primaryMatches: College[] = [];
    const secondaryMatches: College[] = [];

    for (const college of colleges) {
      const isPerfectMatch = (college.topColor === primaryColor && college.topSupportingColor === secondaryColor) ||
                             (college.topColor === secondaryColor && college.topSupportingColor === primaryColor);
      
      const isPrimaryMatch = college.topColor === primaryColor;
      const isSecondaryMatch = college.topColor === secondaryColor;

      if (isPerfectMatch) {
        perfectMatches.push(college);
      } else if (isPrimaryMatch) {
        primaryMatches.push(college);
      } else if (isSecondaryMatch) {
        secondaryMatches.push(college);
      }
    }
    
    // Combine the lists, ensuring no duplicates and prioritizing the best matches.
    // The order is Perfect > Primary > Secondary.
    return [...perfectMatches, ...primaryMatches, ...secondaryMatches];

  } catch (error) {
    console.error("Error finding college matches:", error);
    return []; // Return an empty array on error
  }
}