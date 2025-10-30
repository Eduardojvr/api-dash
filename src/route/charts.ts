import { Router } from 'express';
import { getChart } from '../controller/chartsController';
import { validateChartRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', validateChartRequest, getChart);

export default router;