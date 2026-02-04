import { marketRepository } from '../repositories/marketRepository';
import { MarketQueryParams } from '../schemas/market.schema';

/**
 * Handles business logic for Market operations, acting as the intermediary
 * between Controllers and Repositories.
 */
export const marketService = {
  /**
   * Retrieves the Total Value Locked (TVL).
   *
   * @param chainId - Optional chain ID filter.
   * @param name - Optional name filter.
   * @param id - Optional market ID.
   * @returns The TVL as a string.
   */
  getTvl: async (
    chainId?: MarketQueryParams['chain_id'],
    name?: MarketQueryParams['name'],
    id?: string,
  ): Promise<string> => {
    const result = await marketRepository.getTvl(chainId, name, id);

    if (result === null) {
      if (id) {
        throw new Error('Market not found');
      }
      return '0';
    }

    return result;
  },

  /**
   * Calculates the aggregated Liquidity (Total Supply - Total Borrow).
   *
   * @param chainId - Optional chain ID filter.
   * @param name - Optional name filter.
   * @param id - Optional market ID.
   * @returns The calculated liquidity amount as a string.
   */
  getLiquidity: async (
    chainId?: MarketQueryParams['chain_id'],
    name?: MarketQueryParams['name'],
    id?: string,
  ): Promise<string> => {
    const metrics = await marketRepository.getMetrics(chainId, name, id);

    if (!metrics) {
      if (id) {
        throw new Error('Market not found');
      }
      return '0';
    }

    // Use BigInt for financial calculations to prevent precision loss.
    // The repository guarantees these values are strings (defaulting to '0').
    const supply = BigInt(metrics.totalSupply!);
    const borrow = BigInt(metrics.totalBorrow!);

    return (supply - borrow).toString();
  },
};
