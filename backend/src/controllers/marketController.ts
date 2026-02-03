import { Request, Response } from 'express';
import { marketService } from '../services/marketService';
import { SUPPORTED_CHAINS } from '../constants/chains'; // <--- Import constants

/**
 * Controller: Handles HTTP requests for Market endpoints.
 */
export const marketController = {
  /**
   * GET /tvl
   * Retrieves the Total Value Locked.
   * Validates the request parameters before calling the service.
   */
  getTvl: async (req: Request, res: Response): Promise<void> => {
    try {
      const { chain_id } = req.query;

      // Input Validation
      if (chain_id) {
        // Use the centralized constant for validation
        if (!SUPPORTED_CHAINS.includes(String(chain_id))) {
          res.status(400).json({
            error: `Invalid chain_id. Allowed values: ${SUPPORTED_CHAINS.join(', ')}`,
          });
          return;
        }
      }

      // Call Service Layer
      const marketTvl = await marketService.getTvl(chain_id as string);

      // Send JSON Response
      res.json({ marketTvl });
    } catch (error) {
      console.error('Error in marketController.getTvl:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
