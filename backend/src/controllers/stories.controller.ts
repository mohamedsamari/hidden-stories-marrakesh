import {Request, Response} from 'express';
import {storiesService} from '../services/stories.service';

export const storiesController = {
    async getAll(req: Request, res: Response){
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filters = {
                categoryId: req.query.categoryId as string | undefined,
                historicalPeriodId: req.query.historicalPeriodId as string | undefined,
                dynastyId: req.query.dynastyId as string | undefined,
                century: req.query.century ? parseInt(req.query.century as string) : undefined,
                };

            const stories = await storiesService.getAllStories(page, limit, filters);
            res.status(200).json(stories);
        }
        catch (error) {
            console.error('Erreur dans getAll stories:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
        }
    },
    async getById(req: Request<{ id: string }>, res: Response){
        try{
            const  id  = req.params.id;
            const story = await storiesService.getStoryById(id);
            if (!story) {
        return res.status(404).json({ message: 'Histoire introuvable.' });
      }
            res.status(200).json(story);
        }
        catch (error) {
            console.error('Erreur dans getById story:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération de l\'histoire.' });
        }
    }
}