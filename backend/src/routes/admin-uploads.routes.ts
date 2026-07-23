import { Router } from 'express';
import { uploadsController } from '../controllers/uploads.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { uploadSingleImage } from '../middlewares/upload.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', uploadSingleImage, uploadsController.upload);

export default router;
