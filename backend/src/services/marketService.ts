import { marketRepository } from '../repositories/marketRepository';

/**
 * Service: Handles business logic for Market operations.
 * Acts as an intermediary between the Controller and the Repository.
 */
export const marketService = {
  /**
   * Gets the Total Value Locked (TVL).
   * Future business logic (e.g., calculation, aggregation) can be added here.
   * * @param chainId - Optional chain ID filter.
   * @returns The TVL as a string.
   */
  getTvl: async (chainId?: string): Promise<string> => {
    return await marketRepository.getTvl(chainId);
  },
};
