import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createCategorySchema), categoriesController.create);
router.patch('/:id', validateBody(updateCategorySchema), categoriesController.update);
router.delete('/:id', categoriesController.remove);

export default router;
