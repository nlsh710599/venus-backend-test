import { Router } from 'express';
import { marketController } from '../controllers/marketController';

const router = Router();

/**
 * GET /tvl
 * Route to fetch the Total Value Locked.
 */
router.get('/tvl', marketController.getTvl);

/**
 * GET /liquidity
 * Route to fetch the aggregated Liquidity (Supply - Borrow).
 */
router.get('/liquidity', marketController.getLiquidity);

export default router;
