import { Router } from 'express';
import { marketController } from '../controllers/marketController';

const router = Router();

/**
 * GET /tvl
 * Route to fetch the Total Value Locked.
 */
router.get('/tvl', marketController.getTvl);

export default router;
