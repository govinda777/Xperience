import { createClient } from 'redis';

const url = process.env.KV_URL || process.env.REDIS_URL;

const client = createClient({
  url,
});

client.on('error', (err) => console.error('Redis Client Error', err));

if (!client.isOpen) {
  await client.connect();
}

export default client;
