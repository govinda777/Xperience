import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('CRITICAL ERROR: OPENAI_API_KEY is missing in environment variables.');
    return response.status(500).json({ error: 'Server configuration error' });
  }

  // Log success (masked) for debugging purposes
  console.log(`OpenAI API Key found (starts with: ${apiKey.substring(0, 3)}...)`);

  const openai = new OpenAI({ apiKey });

  try {
    const { messages } = request.body;

    if (!messages || !Array.isArray(messages)) {
      return response.status(400).json({ error: 'Messages array is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    return response.status(200).json({
      message: completion.choices[0].message
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return response.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}
