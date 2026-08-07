import { Request, Response } from 'express';
import { locationPlanPointsService } from '../services/location-plan-points.service';

export const locationPlanPointsController = {
  async getAllForLocation(req: Request<{ id: string }>, res: Response) {
    try {
      const points = await locationPlanPointsService.getPlanPointsForLocation(req.params.id);
      res.status(200).json(points);
    } catch (error) {
      console.error('Erreur dans getAllForLocation plan points:', error);
      res
        .status(500)
        .json({ message: 'Une erreur est survenue lors de la récupération des points du plan.' });
    }
  },
};
