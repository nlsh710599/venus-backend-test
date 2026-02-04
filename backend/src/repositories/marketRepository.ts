import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

export interface TvlResult extends RowDataPacket {
  marketTvl: string | null;
}

interface MarketMetrics {
  totalSupply: string | null;
  totalBorrow: string | null;
}

/**
 * Handles direct database interactions for the Market entity.
 */
export const marketRepository = {
  /**
   * Retrieves the aggregated Total Value Locked (TVL).
   *
   * @param chainId - Optional chain ID filter.
   * @param name - Optional token name filter.
   * @param id - Optional market ID filter.
   * @returns The total TVL as a string, or null if no data is found.
   */
  getTvl: async (
    chainId?: string,
    name?: string,
    id?: string,
  ): Promise<string | null> => {
    let query = 'SELECT SUM(total_supply_cents) as marketTvl FROM market';
    const params: string[] = [];
    const conditions: string[] = [];

    if (chainId) {
      conditions.push('chain_id = ?');
      params.push(chainId);
    }
    if (name) {
      conditions.push('name = ?');
      params.push(name);
    }
    if (id) {
      conditions.push('id = ?');
      params.push(id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query<TvlResult[]>(query, params);

    return rows[0]?.marketTvl ?? null;
  },

  /**
   * Retrieves aggregated Total Supply and Total Borrow metrics.
   * Typically used by the service layer to calculate Liquidity.
   *
   * @param chainId - Optional chain ID filter.
   * @param name - Optional token name filter.
   * @param id - Optional market ID filter.
   * @returns An object containing totalSupply and totalBorrow, or null if no data found.
   */
  getMetrics: async (
    chainId?: string,
    name?: string,
    id?: string,
  ): Promise<MarketMetrics | null> => {
    let query = `
      SELECT 
        SUM(total_supply_cents) as totalSupply, 
        SUM(total_borrow_cents) as totalBorrow 
      FROM market
    `;
    const params: string[] = [];
    const conditions: string[] = [];

    if (chainId) {
      conditions.push('chain_id = ?');
      params.push(chainId);
    }
    if (name) {
      conditions.push('name = ?');
      params.push(name);
    }
    if (id) {
      conditions.push('id = ?');
      params.push(id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const result = rows[0];

    if (!result || result.totalSupply === null) {
      return null;
    }

    return {
      totalSupply: result.totalSupply,
      totalBorrow: result.totalBorrow,
    };
  },
};
