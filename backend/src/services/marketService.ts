import { marketRepository } from '../repositories/marketRepository';

/**
 * Service: Handles business logic for Market operations.
 * Acts as an intermediary between the Controller and the Repository.
 */
export const marketService = {
  /**
   * Gets the Total Value Locked (TVL).
   * Future business logic (e.g., calculation, aggregation) can be added here.
   * @param chainId - Optional chain ID filter.
   * @param name - Optional name filter.
   * @returns The TVL as a string.
   */
  getTvl: async (
    chainId?: string,
    name?: string,
    id?: string,
  ): Promise<string> => {
    return await marketRepository.getTvl(chainId, name, id);
  },

  /**
   * Calculates the Liquidity (Total Supply - Total Borrow).
   * Performs BigInt arithmetic to ensure precision with financial data.
   * @param chainId - Optional chain ID filter.
   * @param name - Optional name filter.
   * @returns The liquidity amount as a string.
   */
  getLiquidity: async (
    chainId?: string,
    name?: string,
    id?: string,
  ): Promise<string> => {
    // 1. Fetch raw metrics (supply and borrow) from repository
    const metrics = await marketRepository.getMetrics(chainId, name, id);

    // 2. Perform calculation using BigInt for safety
    // Note: The repository guarantees these values are strings (default '0')
    const supply = BigInt(metrics.totalSupply);
    const borrow = BigInt(metrics.totalBorrow);

    // 3. Liquidity = Supply - Borrow
    // Convert back to string to preserve precision
    return (supply - borrow).toString();
  },
};
