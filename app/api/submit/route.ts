import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { full_name, email, personaName, state } = await request.json();

    if (!personaName || !state || !full_name || !email) {
      throw new Error("Missing required submission fields: full_name, email, personaName, and state are required.");
    }

    // This ensures the table and all necessary columns exist.
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        affiliation VARCHAR(100),
        top_two_colors VARCHAR(100),
        persona_name VARCHAR(100),
        state VARCHAR(100),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure columns allow NULLs
    await sql`ALTER TABLE quiz_submissions ALTER COLUMN full_name DROP NOT NULL;`;
    await sql`ALTER TABLE quiz_submissions ALTER COLUMN email DROP NOT NULL;`;
    await sql`ALTER TABLE quiz_submissions ALTER COLUMN affiliation DROP NOT NULL;`;
    await sql`ALTER TABLE quiz_submissions ALTER COLUMN top_two_colors DROP NOT NULL;`;

    // Ensure the 'state' column exists.
    await sql`ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS state VARCHAR(100);`;

    // Now, the INSERT statement will succeed.
    await sql`
      INSERT INTO quiz_submissions (full_name, email, persona_name, state)
      VALUES (${full_name}, ${email}, ${personaName}, ${state});
    `;

    return NextResponse.json({ message: 'Submission Saved' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to save submission.', details: errorMessage }, { status: 500 });
  }
}