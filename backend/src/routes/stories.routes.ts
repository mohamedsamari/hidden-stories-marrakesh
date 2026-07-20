import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';

const router = Router();

router.get('/', storiesController.getAll);
router.get('/:id', storiesController.getById);

export default router;