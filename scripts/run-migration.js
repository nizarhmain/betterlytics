require('dotenv').config();
const { execSync } = require('child_process');

const url = process.env.CLICKHOUSE_URL;
const db = process.env.CLICKHOUSE_DB;

if (!url || !db) {
  console.error('Error: CLICKHOUSE_URL and CLICKHOUSE_DB must be set in .env file');
  process.exit(1);
}

const command = `clickhouse-migrations migrate --host=${url} --db=${db} --migrations-home=./migrations --user=default --password=`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}