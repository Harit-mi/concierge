const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'concierge.db');
const backupDir = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error(`Database file does not exist at: ${dbPath}`);
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `concierge-backup-${timestamp}.db`);

console.log(`Starting non-blocking hot backup from ${dbPath} to ${backupFile}...`);

const db = new Database(dbPath, { readonly: true });

db.backup(backupFile)
  .then(() => {
    // Verify backup integrity
    const backupDb = new Database(backupFile, { readonly: true });
    const integrity = backupDb.pragma('integrity_check');
    backupDb.close();

    console.log(`Backup completed successfully! Integrity check: ${JSON.stringify(integrity)}`);
    console.log(`Backup size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Backup failed:', err);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
