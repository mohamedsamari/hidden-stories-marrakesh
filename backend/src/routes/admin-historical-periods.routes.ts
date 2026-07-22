import { Router } from 'express';
import { historicalPeriodsController } from '../controllers/historical-periods.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createHistoricalPeriodSchema, updateHistoricalPeriodSchema } from '../validators/historical-period.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createHistoricalPeriodSchema), historicalPeriodsController.create);
router.patch('/:id', validateBody(updateHistoricalPeriodSchema), historicalPeriodsController.update);
router.delete('/:id', historicalPeriodsController.remove);

export default router;
