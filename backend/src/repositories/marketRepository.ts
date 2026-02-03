import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

// Define the interface for the database query result
export interface TvlResult extends RowDataPacket {
  marketTvl: string | null;
}

/**
 * Repository: Handles all direct database interactions for the Market entity.
 */
export const marketRepository = {
  /**
   * Retrieves the Total Value Locked (TVL) from the market table.
   * @param chainId - Optional chain ID to filter the results.
   * @returns A promise that resolves to the total TVL as a string.
   */
  getTvl: async (chainId?: string): Promise<string> => {
    let sql = 'SELECT SUM(total_supply_cents) as marketTvl FROM market';
    const params: any[] = [];

    // Apply filter if chainId is provided
    if (chainId) {
      sql += ' WHERE chain_id = ?';
      params.push(chainId);
    }

    // Execute the query
    const [rows] = await pool.query<TvlResult[]>(sql, params);

    // Process the result: ensure a string is returned even if the result is null
    const rawTvl = rows[0]?.marketTvl;
    return rawTvl ? rawTvl.toString() : '0';
  },
};
