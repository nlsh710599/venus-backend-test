import { Request, Response } from 'express';
import { marketService } from '../services/marketService';
import { HttpStatusCode } from '../constants/httpStatus';

/**
 * Controller: Handles HTTP requests for Market endpoints.
 */
export const marketController = {
  /**
   * GET /tvl
   * Retrieves the Total Value Locked.
   * Validates the request parameters before calling the service.
   * Supports filtering by 'chain_id' and 'name'.
   */
  getTvl: async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters
      const { chain_id, name } = req.query;

      // Call Service Layer with both filters
      const marketTvl = await marketService.getTvl(
        chain_id as string,
        name as string,
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
   * Supports filtering by 'chain_id' and 'name'.
   */
  getLiquidity: async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters
      const { chain_id, name } = req.query;

      // Call Service Layer with both filters
      const marketLiquidity = await marketService.getLiquidity(
        chain_id as string,
        name as string,
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

  /**
   * GET /:id/tvl
   * Retrieves TVL for a specific market ID.
   */
  getTvlById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const marketTvl = await marketService.getTvl(undefined, undefined, id);

      res.status(HttpStatusCode.OK).json({ marketTvl });
    } catch (error) {
      console.error('Error in marketController.getTvlById:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },

  /**
   * GET /:id/liquidity
   * Retrieves Liquidity for a specific market ID.
   */
  getLiquidityById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const marketLiquidity = await marketService.getLiquidity(
        undefined,
        undefined,
        id,
      );

      res.status(HttpStatusCode.OK).json({ marketLiquidity });
    } catch (error) {
      console.error('Error in marketController.getLiquidityById:', error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  },
};
