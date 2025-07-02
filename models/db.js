const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

module.exports = pool;
