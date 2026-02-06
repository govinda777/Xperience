import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleInboundMessage } from '../../../lib/agent/inboundHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // WhatsApp Cloud API Verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // In production, compare with process.env.WHATSAPP_VERIFY_TOKEN
    // For this POC, we'll accept a dummy token or just check existence
    if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'test_token')) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // Event Notification
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Basic extraction for WhatsApp Cloud API structure
      // Note: Structure varies by API version and message type
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];

      // If it's not a message event (e.g. status update), just ack
      if (!message) {
        return res.status(200).send('EVENT_RECEIVED');
      }

      const from = message.from;
      const text = message.text?.body || '';

      await handleInboundMessage({
        provider: 'whatsapp',
        externalId: message.id,
        from: from,
        text: text,
        raw: body
      });

      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('WhatsApp Webhook Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  return res.status(405).send('Method Not Allowed');
}
