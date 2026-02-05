import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from './lib/kv';

const anonimizarNome = (str?: string) => str && str.length > 4 ? str.slice(0,4) + '...' : str || 'Anônimo';
const anonimizarEmail = (email?: string) => email ? email.replace(/(.{1,3}).+@(.{1,3}).+/, '$1***@$2***') : '***@***';

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

  try {
    const { type, data } = request.body;

    if (!type || !data) {
        return response.status(400).json({ error: 'Missing type or data' });
    }

    const timestamp = new Date().toISOString();
    // Generate a public ID
    const publicId = `sub_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

    const lead = { ...data, timestamp, id: publicId };

    if (type === 'contact') {
      // 1. Save private lead
      await kv.lpush('leads:contact', lead);

      // 2. Save public anonymized submission
      const submission = {
        id: publicId,
        nomeAnon: anonimizarNome(data.name || data.nome),
        emailAnon: anonimizarEmail(data.email),
        mensagem: data.needs || data.mensagem || '',
        data: timestamp
      };
      await kv.lpush('submissions_list', JSON.stringify(submission));

    } else if (type === 'newsletter') {
      // 1. Save private lead
      await kv.lpush('leads:newsletter', lead);

      // 2. Save public anonymized submission
      const submission = {
        id: publicId,
        nomeAnon: 'Newsletter',
        emailAnon: anonimizarEmail(data.email),
        mensagem: 'Inscreveu-se na newsletter',
        data: timestamp
      };
      await kv.lpush('submissions_list', JSON.stringify(submission));
    } else {
      return response.status(400).json({ error: 'Invalid type. Must be "contact" or "newsletter"' });
    }

    // Common KV operations
    await kv.ltrim('submissions_list', 0, 999); // Keep max 1000
    await kv.incr('total_submissions');

    return response.status(200).json({ success: true, id: publicId });
  } catch (error) {
    console.error('KV Error:', error);
    // Fallback if KV is not configured (e.g. locally without env vars)
    if (process.env.NODE_ENV === 'development' && !process.env.KV_REST_API_URL && !process.env.REDIS_URL) {
        console.warn('KV not configured. Mocking success.');
        // Generate a mock ID for dev
        const mockId = `mock_${Date.now()}`;
        return response.status(200).json({ success: true, id: mockId, mocked: true });
    }
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
