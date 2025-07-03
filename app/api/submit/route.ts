import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Update to expect only the fields being sent from the frontend
    const { personaName, state } = await request.json();

    // Update the check for the required fields
    if (!personaName || !state) {
      throw new Error("Missing required submission fields: personaName and state are required.");
    }

    // Update the database table schema
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        persona_name VARCHAR(100),
        state VARCHAR(100),
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Update the INSERT statement to match the new schema
    await sql`
      INSERT INTO quiz_submissions (persona_name, state)
      VALUES (${personaName}, ${state});
    `;

    return NextResponse.json({ message: 'Submission Saved' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    // Send a more informative error message back for debugging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to save submission.', details: errorMessage }, { status: 500 });
  }
}