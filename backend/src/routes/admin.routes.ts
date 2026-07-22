import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';

const router = Router();

router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

export default router;