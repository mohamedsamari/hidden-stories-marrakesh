import { Request, Response } from 'express';
import { storyReferencesService } from '../services/story-references.service';

export const storyReferencesController = {
  async getAllForStory(req: Request<{ id: string }>, res: Response) {
    try {
      const references = await storyReferencesService.getReferencesForPublishedStory(req.params.id);
      if (references === null) {
        return res.status(404).json({ message: 'Histoire introuvable.' });
      }
      res.status(200).json(references);
    } catch (error) {
      console.error('Erreur dans getAllForStory story references:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des références.' });
    }
  },
};
