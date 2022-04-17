var Pool = require('pg-pool')
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    ssl: false
  };
  const db = new Pool(config)
  export { db }