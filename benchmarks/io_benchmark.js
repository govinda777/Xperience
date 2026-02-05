const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const iterations = 500;
const testFile = path.join(__dirname, 'test_db.json');
// Make file larger to make the blocking more noticeable
const data = JSON.stringify({ clients: Array(1000).fill({ name: 'Test', id: 1 }) });

// Setup
fs.writeFileSync(testFile, data);

function sleeper(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function benchmark() {
  console.log(`Running benchmark with ${iterations} iterations...`);

  // --- Sync Benchmark ---
  console.log('--- Sync Benchmark ---');
  let syncBlockedCount = 0;
  const syncInterval = setInterval(() => {
    syncBlockedCount++;
  }, 1);

  const startSync = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    const fileData = fs.readFileSync(testFile, 'utf8');
    JSON.parse(fileData);
  }
  const endSync = process.hrtime.bigint();
  clearInterval(syncInterval);

  const timeSync = Number(endSync - startSync) / 1e6;
  console.log(`Sync Time: ${timeSync.toFixed(2)} ms`);
  console.log(`Event Loop Ticks during Sync: ${syncBlockedCount}`);

  // --- Async Benchmark ---
  console.log('\n--- Async Benchmark ---');
  let asyncBlockedCount = 0;
  const asyncInterval = setInterval(() => {
    asyncBlockedCount++;
  }, 1);

  const startAsync = process.hrtime.bigint();
  const promises = [];
  // Use a chunked approach to avoid EMFILE or thread pool exhaustion dominance
  // But for simple "non-blocking" proof, standard loop is fine.
  for (let i = 0; i < iterations; i++) {
    promises.push(fsPromises.readFile(testFile, 'utf8').then(JSON.parse));
  }
  await Promise.all(promises);
  const endAsync = process.hrtime.bigint();
  clearInterval(asyncInterval);

  const timeAsync = Number(endAsync - startAsync) / 1e6;
  console.log(`Async Time: ${timeAsync.toFixed(2)} ms`);
  console.log(`Event Loop Ticks during Async: ${asyncBlockedCount}`);

  // Cleanup
  fs.unlinkSync(testFile);
}

benchmark().catch(console.error);
