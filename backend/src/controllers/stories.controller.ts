import {Request, Response} from 'express';
import {storiesService} from '../services/stories.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleWriteError } from '../utils/db-error.util';

function parseListParams(req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
        categoryId: req.query.categoryId as string | undefined,
        historicalPeriodId: req.query.historicalPeriodId as string | undefined,
        dynastyId: req.query.dynastyId as string | undefined,
        century: req.query.century ? parseInt(req.query.century as string) : undefined,
        search: req.query.search as string | undefined,
    };
    const sort = {
        sortBy: req.query.sortBy as 'titleEn' | 'createdAt' | 'century' | undefined,
        order: req.query.order as 'asc' | 'desc' | undefined,
    };
    return { page, limit, filters, sort };
}

export const storiesController = {
    async getAll(req: Request, res: Response){
        try{
            const { page, limit, filters, sort } = parseListParams(req);
            const stories = await storiesService.getAllStories(page, limit, filters, sort);
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
    },

    async getAllAdmin(req: Request, res: Response) {
        try {
            const { page, limit, filters, sort } = parseListParams(req);
            const isPublishedParam = req.query.isPublished as string | undefined;
            const adminFilters = {
                ...filters,
                isPublished: isPublishedParam === undefined ? undefined : isPublishedParam === 'true',
            };
            const stories = await storiesService.getAllStoriesAdmin(page, limit, adminFilters, sort);
            res.status(200).json(stories);
        } catch (error) {
            console.error('Erreur dans getAllAdmin stories:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
        }
    },

    async getByIdAdmin(req: Request<{ id: string }>, res: Response) {
        try {
            const story = await storiesService.getStoryByIdAdmin(req.params.id);
            if (!story) {
                return res.status(404).json({ message: 'Histoire introuvable.' });
            }
            res.status(200).json(story);
        } catch (error) {
            console.error('Erreur dans getByIdAdmin story:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération de l\'histoire.' });
        }
    },

    async create(req: AuthenticatedRequest, res: Response) {
        try {
            const newStory = await storiesService.createStory(req.body);
            res.status(201).json(newStory);
        } catch (error) {
            handleWriteError(error, res, 'création', "l'histoire");
        }
    },

    async update(req: AuthenticatedRequest<{ id: string }>, res: Response) {
        try {
            const updated = await storiesService.updateStory(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Histoire introuvable.' });
            }
            res.status(200).json(updated);
        } catch (error) {
            handleWriteError(error, res, 'mise à jour', "l'histoire");
        }
    },

    async remove(req: AuthenticatedRequest<{ id: string }>, res: Response) {
        try {
            const deleted = await storiesService.deleteStory(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Histoire introuvable.' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Erreur dans delete story:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'histoire.' });
        }
    },

    async publish(req: AuthenticatedRequest<{ id: string }>, res: Response) {
        try {
            const story = await storiesService.publishStory(req.params.id);
            if (!story) {
                return res.status(404).json({ message: 'Histoire introuvable.' });
            }
            res.status(200).json(story);
        } catch (error) {
            console.error('Erreur dans publish story:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la publication de l\'histoire.' });
        }
    },

    async unpublish(req: AuthenticatedRequest<{ id: string }>, res: Response) {
        try {
            const story = await storiesService.unpublishStory(req.params.id);
            if (!story) {
                return res.status(404).json({ message: 'Histoire introuvable.' });
            }
            res.status(200).json(story);
        } catch (error) {
            console.error('Erreur dans unpublish story:', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la dépublication de l\'histoire.' });
        }
    },
}