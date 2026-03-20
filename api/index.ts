import type { VercelRequest, VercelResponse } from '@vercel/node';
import agentHandler from './_routes/agent.js';
import chatHandler from './_routes/chat.js';
import healthHandler from './_routes/health.js';
import healthConfigHandler from './_routes/health-config.js';
import leadsHandler from './_routes/leads.js';
import searchConsoleHandler from './_routes/search-console.js';
import submissionsHandler from './_routes/submissions.js';
import sessionHandler from './_routes/user/session.js';
import roleHandler from './_routes/admin/user/[userId]/role.js';
import telegramWebhookHandler from './_routes/webhooks/telegram/route.js';
import whatsappWebhookHandler from './_routes/webhooks/whatsapp/route.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const path = url.pathname;

  console.log(`[Router] ${req.method} ${path}`);

  // Basic CORS for all routes (consistent with existing handlers)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Simple Router
    if (path === '/api/agent') return await agentHandler(req, res);
    if (path === '/api/chat') return await chatHandler(req, res);
    if (path === '/api/health') return await healthHandler(req, res);
    if (path === '/api/health-config') return await healthConfigHandler(req, res);
    if (path === '/api/leads') return await leadsHandler(req, res);
    if (path === '/api/search-console') return await searchConsoleHandler(req, res);
    if (path === '/api/submissions') return await submissionsHandler(req, res);
    if (path === '/api/user/session') return await sessionHandler(req, res);
    if (path === '/api/webhooks/telegram') return await telegramWebhookHandler(req, res);
    if (path === '/api/webhooks/whatsapp') return await whatsappWebhookHandler(req, res);

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
