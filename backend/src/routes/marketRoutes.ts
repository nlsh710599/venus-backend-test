import { Router } from 'express';
import { marketController } from '../controllers/marketController';
import { validateChainId } from '../middlewares/validateRequest';

const router = Router();

/**
 * GET /tvl
 * Route to fetch the Total Value Locked.
 */
router.get('/tvl', validateChainId, marketController.getTvl);

/**
 * GET /liquidity
 * Route to fetch the aggregated Liquidity (Supply - Borrow).
 */
router.get('/liquidity', validateChainId, marketController.getLiquidity);

export default router;
