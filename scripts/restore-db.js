const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const backupFile = process.argv[2];
if (!backupFile || !fs.existsSync(backupFile)) {
  console.error('Usage: node scripts/restore-db.js <path-to-backup.db>');
  process.exit(1);
}

const targetDbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'concierge.db');

console.log(`Verifying backup file integrity: ${backupFile}...`);
try {
  const checkDb = new Database(backupFile, { readonly: true });
  const integrity = checkDb.pragma('integrity_check');
  checkDb.close();

  if (integrity[0]?.integrity_check !== 'ok') {
    throw new Error(`Corrupted backup file: ${JSON.stringify(integrity)}`);
  }
} catch (err) {
  console.error('Verification failed. Aborting restore.', err);
  process.exit(1);
}

console.log(`Backing up active database before overwrite...`);
const rollbackPath = `${targetDbPath}.pre-restore.${Date.now()}`;
if (fs.existsSync(targetDbPath)) {
  fs.copyFileSync(targetDbPath, rollbackPath);
  console.log(`Saved pre-restore snapshot to: ${rollbackPath}`);
}

console.log(`Restoring from ${backupFile} to ${targetDbPath}...`);
fs.copyFileSync(backupFile, targetDbPath);

// Remove stale WAL/SHM files
if (fs.existsSync(`${targetDbPath}-wal`)) fs.unlinkSync(`${targetDbPath}-wal`);
if (fs.existsSync(`${targetDbPath}-shm`)) fs.unlinkSync(`${targetDbPath}-shm`);

console.log('Database restored successfully! Verifying target...');
const restoredDb = new Database(targetDbPath, { readonly: true });
console.log('Restored target integrity check:', restoredDb.pragma('integrity_check'));
restoredDb.close();
