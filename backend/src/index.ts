import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8181;

// Middleware
app.use(cors());
app.use(express.json());

const pool: Pool = createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'app_db',
  port: parseInt(process.env.DB_PORT || '3306'),
});

interface TvlResult extends RowDataPacket {
  marketTvl: string | null;
}

const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return 'Database connection established successfully';
  } catch (error) {
    return `Error connecting to database: ${error}`;
  }
};

app.get('/', async (req: Request, res: Response) => {
  const response = await testDbConnection();
  res.json({ response });
});

/**
 * GET /tvl
 * Retrieves the Total Value Locked (sum of total_supply_cents).
 * * Query Parameters:
 * - chain_id (optional): Filter by chain ID (e.g., '1' or '56')
 */
app.get('/tvl', async (req: Request, res: Response) => {
  try {
    const { chain_id } = req.query;

    let sql = 'SELECT SUM(total_supply_cents) as marketTvl FROM market';
    const params: any[] = [];

    if (chain_id) {
      const validChainIds = ['1', '56'];
      if (!validChainIds.includes(String(chain_id))) {
        res
          .status(400)
          .json({ error: 'Invalid chain_id. Allowed values: 1, 56' });
        return;
      }

      sql += ' WHERE chain_id = ?';
      params.push(chain_id);
    }

    const [rows] = await pool.query<TvlResult[]>(sql, params);

    const rawTvl = rows[0]?.marketTvl;
    const marketTvl = rawTvl ? rawTvl.toString() : '0';

    res.json({ marketTvl });
  } catch (error) {
    console.error('Error in /tvl endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
