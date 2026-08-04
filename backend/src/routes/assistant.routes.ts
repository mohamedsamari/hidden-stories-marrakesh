import { Router } from 'express';
import { assistantController } from '../controllers/assistant.controller';
import { uploadSingleAudio } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @openapi
 * /assistant/chat:
 *   post:
 *     summary: Pose une question à l'assistant IA sur les monuments de Marrakech
 *     tags: [Assistant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réponse de l'assistant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Message manquant
 */
router.post('/chat', assistantController.chat);

/**
 * @openapi
 * /assistant/transcribe:
 *   post:
 *     summary: Transcrit un enregistrement audio en texte (reconnaissance vocale)
 *     tags: [Assistant]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [audio]
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Texte transcrit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *       400:
 *         description: Fichier audio manquant ou invalide
 */
router.post('/transcribe', uploadSingleAudio, assistantController.transcribe);

export default router;
