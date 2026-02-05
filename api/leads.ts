import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from './lib/kv.js';

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

  if (request.method === 'GET') {
    try {
      const rawLeads = await kv.lrange('leads:contact', 0, 49);
      const leads = rawLeads.map((l: any) => (typeof l === 'string' ? JSON.parse(l) : l));
      return response.status(200).json(leads);
    } catch (error) {
      console.error('KV Error (GET):', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
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
    const lead = { ...data, timestamp, id: Date.now().toString() };

    if (type === 'contact') {
      await kv.lpush('leads:contact', lead);
    } else if (type === 'newsletter') {
      await kv.lpush('leads:newsletter', lead);
    } else {
      return response.status(400).json({ error: 'Invalid type. Must be "contact" or "newsletter"' });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('KV Error:', error);
    // Fallback if KV is not configured (e.g. locally without env vars)
    if (process.env.NODE_ENV === 'development' && !process.env.KV_REST_API_URL) {
        console.warn('KV not configured. Mocking success.');
        return response.status(200).json({ success: true, mocked: true });
    }
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
