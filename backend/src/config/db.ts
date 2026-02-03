import { createPool, Pool } from 'mysql2/promise';
import { config } from './env';

// Create the connection pool using the validated config
const pool: Pool = createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
