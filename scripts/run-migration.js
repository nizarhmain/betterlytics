require("dotenv").config();
const { execSync } = require("child_process");

const url = process.env.CLICKHOUSE_URL;
const db = process.env.CLICKHOUSE_DB;
const user = process.env.CLICKHOUSE_USER;
const password = process.env.CLICKHOUSE_PASSWORD;

if (!url || !db) {
  console.error(
    "Error: CLICKHOUSE_URL and CLICKHOUSE_DB must be set in .env file"
  );
  process.exit(1);
}

const command = `clickhouse-migrations migrate --host=${url} --db=${db} --migrations-home=./migrations --user=${user} --password=${password}`;

console.log("[+] Waiting for Clickhouse to start");
new Promise((resolve) => setTimeout(resolve, 5_000))
  .then(() => execSync(command, { stdio: "inherit" }))
  .catch(() => {
    console.error("Migration failed:", error.message);
    process.exit(1);
  });
