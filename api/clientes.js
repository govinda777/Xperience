import client from './_lib/redis.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const lead = { ...req.body, id: Date.now(), status: 'Enviado' };

      // Use RPUSH to append to the end (mimics array.push)
      await client.rPush('clientes', JSON.stringify(lead));

      // Keep only the last 50
      await client.lTrim('clientes', -50, -1);

      res.status(200).json({ success: true });
    } else {
      // Get the last 10 (mimics slice(-10))
      const leads = await client.lRange('clientes', -10, -1);
      const parsedLeads = leads.map(l => JSON.parse(l));

      res.status(200).json(parsedLeads);
    }
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
