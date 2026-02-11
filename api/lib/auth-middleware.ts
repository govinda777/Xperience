import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyPrivyToken } from '../../lib/privy-server';
import { SessionService } from '../../lib/services/session-service';
import { UserSession } from '../../src/types/session';

export interface AuthenticatedRequest extends VercelRequest {
  session?: UserSession;
  userId?: string;
}

type Handler = (req: AuthenticatedRequest, res: VercelResponse) => Promise<void | VercelResponse>;

export function withAuth(handler: Handler) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Handle OPTIONS if needed, but usually handled by infrastructure or other middleware
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const claims = await verifyPrivyToken(token);

      if (!claims) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Create full session
      const session = await SessionService.createSession(
        claims.user_id,
        claims.session_id || ''
      );

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.session = session;
      authenticatedReq.userId = claims.user_id;

      return handler(authenticatedReq, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}
