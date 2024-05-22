const { Pool } = require('pg');

const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'AccommodoAppDB',
   password: 'baze',
   port: 5432,
});

module.exports = pool;
