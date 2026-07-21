import { Router } from 'express';
import { historicalPeriodsController } from '../controllers/historical-periods.controller';

const router = Router();

router.get('/', historicalPeriodsController.getAll);

export default router;