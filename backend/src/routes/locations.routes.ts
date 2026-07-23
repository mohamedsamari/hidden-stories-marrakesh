import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';
import { locationImagesController } from '../controllers/location-images.controller';

const router = Router();

router.get('/', locationsController.getAll);
router.get('/:id/images', locationImagesController.getAllForLocation);

export default router;