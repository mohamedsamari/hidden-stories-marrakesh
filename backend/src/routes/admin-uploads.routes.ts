import { Router } from 'express';
import { uploadsController } from '../controllers/uploads.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { uploadSingleImage } from '../middlewares/upload.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /admin/uploads:
 *   post:
 *     summary: Upload une image (jpeg/png/webp/gif, 5 Mo max) et renvoie son URL publique
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       201:
 *         description: Fichier uploadé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Aucun fichier, type non autorisé, ou fichier trop volumineux
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentification requise
 */
router.post('/', uploadSingleImage, uploadsController.upload);

export default router;
