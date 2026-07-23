import { Router } from 'express';
import { storyImagesController } from '../controllers/story-images.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createStoryImageSchema, updateStoryImageSchema } from '../validators/story-image.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createStoryImageSchema), storyImagesController.create);
router.patch('/:id', validateBody(updateStoryImageSchema), storyImagesController.update);
router.delete('/:id', storyImagesController.remove);

export default router;
