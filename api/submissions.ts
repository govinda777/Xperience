import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from './lib/kv.js';

const anonimizar = (str: string) => str?.length > 4 ? str.slice(0, 4) + '...' : str;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const rawSubs = await kv.lrange('submissions_list', 0, 99);
      const submissions = rawSubs.map((s: any) => (typeof s === 'string' ? JSON.parse(s) : s));
      const total = await kv.get('total_submissions') || 0;

      // Return newest first (already default by LPUSH + LRANGE)
      return res.status(200).json({ submissions, total: Number(total) });
    } catch (e) {
      console.error('Error fetching submissions:', e);
      return res.status(500).json({ error: 'Erro ao carregar' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nome, email, mensagem } = req.body;

      if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Campos obrigatórios' });
      }

      const nomeAnon = anonimizar(nome);
      // Simple masking logic
      const emailAnon = email.replace(/(.{1,3}).+@(.{1,3}).+/, '$1***@$2***');

      const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const submission = {
        id,
        nomeAnon,
        emailAnon,
        mensagem,
        data: new Date().toISOString()
      };

      // Store as JSON string
      await kv.lpush('submissions_list', JSON.stringify(submission));
      await kv.ltrim('submissions_list', 0, 999);
      await kv.incr('total_submissions');

      return res.status(200).json({ success: true, id, msg: 'Submissão anonimizada adicionada!' });
    } catch (e) {
      console.error('Error saving submission:', e);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
