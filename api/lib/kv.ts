import { createClient } from '@vercel/kv';

if (!process.env.REDIS_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('Missing REDIS_URL or KV_REST_API_TOKEN');
}

export const kv = createClient({
  url: process.env.REDIS_URL,
  token: process.env.KV_REST_API_TOKEN,
});
