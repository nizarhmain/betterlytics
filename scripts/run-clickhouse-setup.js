const ClickHouse = require("@clickhouse/client");

require("dotenv").config();

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL;
const CLICKHOUSE_DB = process.env.CLICKHOUSE_DB;
const USER = process.env.CLICKHOUSE_USER;
const PASSWORD = process.env.CLICKHOUSE_PASSWORD;

const CREATE_USER_SQL = `CREATE USER IF NOT EXISTS ${USER} IDENTIFIED WITH sha256_password BY '${PASSWORD}'`;
const TEST = `SELECT * FROM "system"."users" LIMIT 100`;
const GRANT_USER_SQL = `CREATE USER ${USER} IDENTIFIED WITH sha256_password BY '${PASSWORD}'`;

try {
  const clickhouseParams = {
    url: CLICKHOUSE_URL,
    username: "alice",
    password: "hello",
    application: "analytics",
  };

  const client = ClickHouse.createClient(clickhouseParams);
  console.log(client);
  client
    .exec({
      query: TEST,
      clickhouse_settings: {
        wait_end_of_query: 1,
      },
    })
    .then(console.log);

  // console.log(res);
  // clickhouse
  //   .query(CREATE_USER_SQL, {
  //     params: {},
  //   })
  //   .toPromise()
  //   .then((result) => console.log(result));
} catch (e) {
  console.error("[-] Error:", e);
}
