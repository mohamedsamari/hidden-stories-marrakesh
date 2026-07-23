import { Router } from 'express';
import { locationImagesController } from '../controllers/location-images.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createLocationImageSchema, updateLocationImageSchema } from '../validators/location-image.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createLocationImageSchema), locationImagesController.create);
router.patch('/:id', validateBody(updateLocationImageSchema), locationImagesController.update);
router.delete('/:id', locationImagesController.remove);
router.patch('/:id/set-cover', locationImagesController.setCover);

export default router;
