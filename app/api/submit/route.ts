import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fullName, email, affiliation, topTwoColors, personaName } = await request.json();

    if (!fullName || !email || !affiliation || !topTwoColors || !personaName) {
      throw new Error("Missing required submission fields.");
    }

    // This is a good practice to ensure the table exists.
    // In a production app, you might run this once separately.
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        affiliation VARCHAR(100),
        top_two_colors VARCHAR(100),
        persona_name VARCHAR(100),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      INSERT INTO quiz_submissions (full_name, email, affiliation, top_two_colors, persona_name)
      VALUES (${fullName}, ${email}, ${affiliation}, ${topTwoColors.join(', ')}, ${personaName});
    `;

    return NextResponse.json({ message: 'Submission Saved' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    // Avoid sending detailed error messages to the client in production
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 });
  }
}