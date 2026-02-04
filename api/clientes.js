import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'public/db.json');

function readDB() {
  try {
    return JSON.parse(readFileSync(dbPath, 'utf8'));
  } catch {
    return { clientes: [] };
  }
}

function writeDB(data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = readDB();
    const lead = { ...req.body, id: Date.now(), status: 'Enviado' };
    db.clientes.push(lead);
    db.clientes = db.clientes.slice(-50); // Limita 50 últimos
    writeDB(db);
    res.status(200).json({ success: true });
  } else {
    const db = readDB();
    res.status(200).json(db.clientes.slice(-10)); // 10 últimos
  }
}
