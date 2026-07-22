import { Router } from 'express';
import { dynastiesController } from '../controllers/dynasties.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createDynastySchema, updateDynastySchema } from '../validators/dynasty.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createDynastySchema), dynastiesController.create);
router.patch('/:id', validateBody(updateDynastySchema), dynastiesController.update);
router.delete('/:id', dynastiesController.remove);

export default router;
