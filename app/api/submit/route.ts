import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { personaName, state } = await request.json();

    if (!personaName || !state) {
      throw new Error("Missing required submission fields: personaName and state are required.");
    }

    // First, ensure the table exists (for the very first run)
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        persona_name VARCHAR(100),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // **THIS IS THE FIX:** Add the 'state' column if it doesn't already exist.
    // This ALTER TABLE command will safely update your existing table schema.
    await sql`
      ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS state VARCHAR(100);
    `;

    // Now, the INSERT statement will succeed.
    await sql`
      INSERT INTO quiz_submissions (persona_name, state)
      VALUES (${personaName}, ${state});
    `;

    return NextResponse.json({ message: 'Submission Saved' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to save submission.', details: errorMessage }, { status: 500 });
  }
}