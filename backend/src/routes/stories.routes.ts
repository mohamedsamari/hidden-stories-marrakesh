import { Router } from 'express';
import { storiesController } from '../controllers/stories.controller';
import { storyImagesController } from '../controllers/story-images.controller';

const router = Router();

router.get('/', storiesController.getAll);
router.get('/:id', storiesController.getById);
router.get('/:id/images', storyImagesController.getAllForStory);

export default router;