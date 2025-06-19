// lib/utils.ts

/**
 * Fetches college data and finds matches based on a tiered system.
 * This version is robust and ignores case and trims whitespace.
 * @param primaryColor The user's primary personality color.
 * @param secondaryColor The user's secondary personality color.
 */
export async function findCollegeMatches(primaryColor: string, secondaryColor: string): Promise<College[]> {
  try {
    const response = await fetch('/colleges.json');
    if (!response.ok) {
      // This error would show in the browser's developer console or Vercel logs
      throw new Error(`Failed to fetch colleges.json: ${response.statusText}`);
    }
    const colleges: College[] = await response.json();

    // Prepare clean, lowercase versions of the user's colors
    const cleanPrimary = primaryColor.trim().toLowerCase();
    const cleanSecondary = secondaryColor.trim().toLowerCase();

    const perfectMatches: College[] = [];
    const primaryMatches: College[] = [];
    const secondaryMatches: College[] = [];
    const addedCollegeNames = new Set<string>(); // To prevent duplicate colleges

    for (const college of colleges) {
      // Ensure college color data exists before trying to process it
      const topColor = college.topColor?.trim().toLowerCase();
      const supportingColor = college.topSupportingColor?.trim().toLowerCase();

      if (!topColor) continue; // Skip colleges with no top color data

      const isPerfectMatch = (topColor === cleanPrimary && supportingColor === cleanSecondary) ||
                             (topColor === cleanSecondary && supportingColor === cleanPrimary);

      if (isPerfectMatch) {
        if (!addedCollegeNames.has(college.name)) {
          perfectMatches.push(college);
          addedCollegeNames.add(college.name);
        }
      }
    }

    // Now, find primary and secondary matches from the remaining colleges
    for (const college of colleges) {
      if (addedCollegeNames.has(college.name)) continue; // Skip if already a perfect match

      const topColor = college.topColor?.trim().toLowerCase();
      if (!topColor) continue;

      if (topColor === cleanPrimary) {
        if (!addedCollegeNames.has(college.name)) {
          primaryMatches.push(college);
          addedCollegeNames.add(college.name);
        }
      } else if (topColor === cleanSecondary) {
        if (!addedCollegeNames.has(college.name)) {
          secondaryMatches.push(college);
          addedCollegeNames.add(college.name);
        }
      }
    }

    // The final, ordered list of unique colleges
    return [...perfectMatches, ...primaryMatches, ...secondaryMatches];

  } catch (error) {
    console.error("Error finding college matches:", error);
    return [];
  }
}