import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_lib/middleware.js';
import agentHandler from './_routes/agent.js';
import trailAgentHandler from './_routes/orchestrator.js';
import chatHandler from './_routes/chat.js';
import leadsHandler from './_routes/leads.js';
import searchConsoleHandler from './_routes/search-console.js';
import sessionHandler from './_routes/user/session.js';
import xpHandler from './_routes/xp/index.js';
import xpVerifyHandler from './_routes/xp/verify.js';
import walletHandler from './_routes/user/wallet.js';
import roleHandler from './_routes/admin/user/[userId]/role.js';
import telegramWebhookHandler from './_routes/webhooks/telegram/route.js';
import whatsappWebhookHandler from './_routes/webhooks/whatsapp/route.js';
import mountainJoinHandler from './_routes/mountain/join.js';
import mountainStatusHandler from './_routes/mountain/status.js';
import mountainExpeditionHandler from './_routes/mountain/expedition.js';
import mountainMapHandler from './_routes/mountain/map.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const path = url.pathname;

  console.log(`[Router] ${req.method} ${path}`);

  // Set global CORS headers
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Simple Router
    if (path === '/api/agent') return await agentHandler(req, res);
    if (path === '/api/agent/orchestrator') return await trailAgentHandler(req, res);
    if (path === '/api/chat') return await chatHandler(req, res);
    if (path === '/api/leads') return await leadsHandler(req, res);
    if (path === '/api/search-console') return await searchConsoleHandler(req, res);
    if (path === '/api/user/session') return await sessionHandler(req, res);
    if (path === '/api/xp') return await xpHandler(req, res);
    if (path.startsWith('/api/xp/verify/')) {
      const address = path.split('/api/xp/verify/')[1];
      req.query = { ...req.query, address };
      return await xpVerifyHandler(req, res);
    }
    if (path === '/api/user/wallet') return await walletHandler(req, res);
    if (path === '/api/webhooks/telegram') return await telegramWebhookHandler(req, res);
    if (path === '/api/webhooks/whatsapp') return await whatsappWebhookHandler(req, res);
    if (path === '/api/mountain/join') return await mountainJoinHandler(req, res);
    if (path === '/api/mountain/status') return await mountainStatusHandler(req, res);
    if (path === '/api/mountain/expedition') return await mountainExpeditionHandler(req, res);
    if (path === '/api/mountain/map') return await mountainMapHandler(req, res);

    // Dynamic Route: /api/admin/user/:userId/role
    const roleMatch = path.match(/^\/api\/admin\/user\/([^/]+)\/role$/);
    if (roleMatch) {
      const userId = roleMatch[1];
      req.query = { ...req.query, userId };
      return await roleHandler(req, res);
    }

    // Default 404
    console.warn(`[Router] Route not found: ${path}`);
    return res.status(404).json({ error: 'Route not found' });
  } catch (error: any) {
    console.error(`[Router] Error handling ${path}:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
