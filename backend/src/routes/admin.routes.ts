import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';

const router = Router();

/**
 * @openapi
 * /admin/me:
 *   get:
 *     summary: Renvoie le contenu décodé du token Kinde envoyé (route de debug)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Claims du JWT décodé
 *       401:
 *         description: Authentification requise
 */
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

export default router;