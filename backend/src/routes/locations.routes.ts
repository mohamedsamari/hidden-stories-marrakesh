import { Router } from 'express';
import { locationsController } from '../controllers/locations.controller';

const router = Router();

router.get('/', locationsController.getAll);

export default router;