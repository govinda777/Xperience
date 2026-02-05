import handler from '../api/clientes.js';
import fs from 'fs';
import path from 'path';

// Ensure public/db.json exists
const dbPath = path.join(process.cwd(), 'public/db.json');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ clientes: [] }));
}

async function verify() {
  console.log('Verifying api/clientes.js...');

  // Mock Request/Response
  const req = {
    method: 'GET',
    body: {}
  };

  const res = {
    statusCode: 0,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };

  // Test GET
  console.log('Testing GET request...');
  await handler(req, res);
  if (res.statusCode !== 200) throw new Error(`GET failed with status ${res.statusCode}`);
  if (!Array.isArray(res.jsonData)) throw new Error('GET response is not an array');
  console.log('GET passed.');

  // Test POST
  console.log('Testing POST request...');
  req.method = 'POST';
  req.body = { name: 'Test Client', email: 'test@example.com' };

  await handler(req, res);
  if (res.statusCode !== 200) throw new Error(`POST failed with status ${res.statusCode}`);
  if (res.jsonData.success !== true) throw new Error('POST response success !== true');
  console.log('POST passed.');

  console.log('All verifications passed!');
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
