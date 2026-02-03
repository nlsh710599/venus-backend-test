import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

// Define the interface for the database query result
export interface TvlResult extends RowDataPacket {
  marketTvl: string | null;
}

interface MarketMetrics {
  totalSupply: string;
  totalBorrow: string;
}

/**
 * Repository: Handles all direct database interactions for the Market entity.
 */
export const marketRepository = {
  /**
   * Retrieves the Total Value Locked (TVL) from the market table.
   * @param chainId - Optional chain ID to filter the results.
   * @param assetName - Optional asset name to filter the results.
   * @returns A promise that resolves to the total TVL as a string.
   */
  getTvl: async (chainId?: string, assetName?: string): Promise<string> => {
    let query = 'SELECT SUM(total_supply_cents) as marketTvl FROM market';
    const params: string[] = [];
    const conditions: string[] = [];

    // Dynamic WHERE clause construction
    if (chainId) {
      conditions.push('chain_id = ?');
      params.push(chainId);
    }
    if (assetName) {
      conditions.push('name = ?');
      params.push(assetName);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Execute the query
    const [rows] = await pool.query<TvlResult[]>(query, params);

    // Process the result: ensure a string is returned even if the result is null
    return rows[0]?.marketTvl ?? '0';
  },

  /**
   * Retrieves both Total Supply and Total Borrow aggregated values.
   * This allows the service layer to calculate Liquidity (Supply - Borrow).
   * @param chainId - Optional chain ID to filter by.
   * @param assetName - Optional asset name to filter the results.
   * @returns An object containing totalSupply and totalBorrow strings.
   */
  getMetrics: async (
    chainId?: string,
    assetName?: string,
  ): Promise<MarketMetrics> => {
    let query = `
      SELECT 
        SUM(total_supply_cents) as totalSupply, 
        SUM(total_borrow_cents) as totalBorrow 
      FROM market
    `;
    const params: string[] = [];
    const conditions: string[] = [];

    // Dynamic WHERE clause construction
    if (chainId) {
      conditions.push('chain_id = ?');
      params.push(chainId);
    }
    if (assetName) {
      conditions.push('name = ?');
      params.push(assetName);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // Default to '0' if no records found to avoid BigInt errors
    return {
      totalSupply: rows[0]?.totalSupply ?? '0',
      totalBorrow: rows[0]?.totalBorrow ?? '0',
    };
  },
};
