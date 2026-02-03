import { Request, Response } from 'express';
import { marketService } from '../services/marketService';
import { HttpStatusCode } from '../constants/httpStatus';
import { SUPPORTED_CHAINS } from '../constants/chains';

/**
 * Controller: Handles HTTP requests for Market endpoints.
 */
export const marketController = {
  /**
   * GET /tvl
   * Retrieves the Total Value Locked.
   * Validates the request parameters before calling the service.
   * Supports filtering by 'chain_id' and 'asset'.
   */
  getTvl: async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters
      const { chain_id, asset } = req.query;

      // Call Service Layer with both filters
      const marketTvl = await marketService.getTvl(
        chain_id as string,
        asset as string,
      );

      // Send JSON Response
      res.status(HttpStatusCode.OK).json({ marketTvl });
    } catch (error) {
      console.error('Error in marketController.getTvl:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },

  /**
   * GET /liquidity
   * Retrieves the aggregated Liquidity (Supply - Borrow).
   * Supports filtering by 'chain_id' and 'asset'.
   */
  getLiquidity: async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters
      const { chain_id, asset } = req.query;

      // Call Service Layer with both filters
      const marketLiquidity = await marketService.getLiquidity(
        chain_id as string,
        asset as string,
      );

      // Send JSON Response
      res.status(HttpStatusCode.OK).json({ marketLiquidity });
    } catch (error) {
      console.error('Error in marketController.getLiquidity:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },
};
