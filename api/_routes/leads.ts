import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_lib/middleware.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = request.body;

    if (!type || !data) {
        return response.status(400).json({ error: 'Missing type or data' });
    }

    const timestamp = new Date().toISOString();
    // Generate a public ID
    const publicId = `sub_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

    // Log the lead data to the server console instead of saving in Redis/KV
    console.log(`[Leads API] New ${type} submission received:`, { id: publicId, timestamp, data });

    return response.status(200).json({ success: true, id: publicId });
  } catch (error) {
    console.error('[Leads API] Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
