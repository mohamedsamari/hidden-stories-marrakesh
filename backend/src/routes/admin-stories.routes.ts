import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createStorySchema, updateStorySchema } from '../validators/story.validator';

const router = Router();

router.use(requireAuth);

router.get('/', storiesController.getAllAdmin);
router.get('/:id', storiesController.getByIdAdmin);
router.post('/', validateBody(createStorySchema), storiesController.create);
router.patch('/:id', validateBody(updateStorySchema), storiesController.update);
router.delete('/:id', storiesController.remove);
router.patch('/:id/publish', storiesController.publish);
router.patch('/:id/unpublish', storiesController.unpublish);

export default router;