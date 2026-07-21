import { Router } from 'express';
import { dynastiesController } from '../controllers/dynasties.controller';

const router = Router();

router.get('/', dynastiesController.getAll);

export default router;