import { Router } from 'express';
import { getChart , createMetric } from '../controller/chartsController';
import { validateChartRequest } from '../middleware/validateRequest';

const router = Router();


router.get('/', validateChartRequest, getChart);
router.post('/', createMetric);

export default router;