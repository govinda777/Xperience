import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const dbPath = join(process.cwd(), 'public/db.json');

async function readDB() {
  try {
    const data = await readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { clientes: [] };
  }
}

async function writeDB(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await readDB();
    const lead = { ...req.body, id: Date.now(), status: 'Enviado' };
    db.clientes.push(lead);
    db.clientes = db.clientes.slice(-50); // Limita 50 últimos
    await writeDB(db);
    res.status(200).json({ success: true });
  } else {
    const db = await readDB();
    res.status(200).json(db.clientes.slice(-10)); // 10 últimos
  }
}
