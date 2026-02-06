import { describe, expect, it, jest } from '@jest/globals';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../route';

// Mock the dependencies
jest.mock('../../../../lib/agent/inboundHandler', () => ({
  handleInboundMessage: jest.fn(),
}));

import { handleInboundMessage } from '../../../../lib/agent/inboundHandler';

describe('WhatsApp Webhook Handler', () => {
  let req: Partial<VercelRequest>;
  let res: Partial<VercelResponse>;
  let send: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    send = jest.fn();
    status = jest.fn(() => ({ send }));
    res = { status: status as any };
  });

  describe('GET verification', () => {
    it('should respond with challenge if token is valid', async () => {
      req = {
        method: 'GET',
        query: {
          'hub.mode': 'subscribe',
          'hub.verify_token': 'test_token', // Matches default fallback in handler
          'hub.challenge': '123456',
        },
      };

      await handler(req as VercelRequest, res as VercelResponse);

      expect(status).toHaveBeenCalledWith(200);
      expect(send).toHaveBeenCalledWith('123456');
    });

    it('should respond with 403 if token is invalid', async () => {
        req = {
          method: 'GET',
          query: {
            'hub.mode': 'subscribe',
            'hub.verify_token': 'wrong_token',
            'hub.challenge': '123456',
          },
        };

        await handler(req as VercelRequest, res as VercelResponse);

        expect(status).toHaveBeenCalledWith(403);
        expect(send).toHaveBeenCalledWith('Forbidden');
      });
  });

  describe('POST event', () => {
      it('should process message events and return 200', async () => {
        const body = {
            entry: [{
                changes: [{
                    value: {
                        messages: [{
                            id: 'msg_123',
                            from: '1234567890',
                            text: { body: 'Hello' }
                        }]
                    }
                }]
            }]
        };

        req = {
            method: 'POST',
            body: body
        };

        await handler(req as VercelRequest, res as VercelResponse);

        expect(handleInboundMessage).toHaveBeenCalledWith({
            provider: 'whatsapp',
            externalId: 'msg_123',
            from: '1234567890',
            text: 'Hello',
            raw: body
        });
        expect(status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith('EVENT_RECEIVED');
      });
  });
});
