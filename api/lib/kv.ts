import { createClient } from '@vercel/kv';

const url = process.env.KV_REST_API_URL || process.env.REDIS_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.warn('KV_REST_API_URL or KV_REST_API_TOKEN not set. KV operations will fail.');
}

export const kv = createClient({
  url: url || '',
  token: token || '',
});
