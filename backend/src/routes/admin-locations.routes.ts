import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createLocationSchema, updateLocationSchema } from '../validators/location.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createLocationSchema), locationsController.create);
router.patch('/:id', validateBody(updateLocationSchema), locationsController.update);
router.delete('/:id', locationsController.remove);

export default router;
