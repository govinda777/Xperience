import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from './lib/kv';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch last 100 submissions
    const rawSubs = await kv.lrange('submissions_list', 0, 99);

    // Parse JSON strings. Handle potential parsing errors safely.
    const submissions = rawSubs.map((s) => {
      if (typeof s === 'string') {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      }
      return s;
    }).filter(Boolean); // Remove nulls

    const total = await kv.get('total_submissions') || 0;

    return response.status(200).json({
      submissions,
      total: parseInt(String(total), 10)
    });
  } catch (error) {
    console.error('KV Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
