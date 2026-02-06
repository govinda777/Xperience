import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleInboundMessage } from '../../../lib/agent/inboundHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = req.body;
    // Telegram Update object structure
    const message = body.message;

    if (!message) {
      return res.status(200).send('OK');
    }

    const chatId = message.chat.id.toString();
    const text = message.text || '';

    await handleInboundMessage({
        provider: 'telegram',
        externalId: message.message_id.toString(),
        from: chatId, // In Telegram, we reply to the chat ID
        text: text,
        raw: body
    });

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
