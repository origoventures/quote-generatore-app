import { NextResponse } from 'next/server';
import { generateFeedback } from '@/services/openai';

export async function POST(request: Request) {
  try {
    const { quote, author } = await request.json();

    if (!quote || !author) {
      return NextResponse.json(
        { error: 'Quote and author are required' },
        { status: 400 }
      );
    }

    const feedback = await generateFeedback(quote, author);
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error in feedback generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
} 