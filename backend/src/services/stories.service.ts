import { storiesRepository } from '../repositories/stories.repository';

export const storiesService = {
  async getAllStories(
    page: number,
    limit: number,
    filters: { categoryId?: string; historicalPeriodId?: string; dynastyId?: string; century?: number }
  ) {
    const safeLimit = limit > 0 ? limit : 10;
    const safePage = page > 0 ? page : 1;
    const offset = (safePage - 1) * safeLimit;

    return storiesRepository.findAll(safeLimit, offset, filters);
  },
  async getStoryById(id: string) {
    const story = await storiesRepository.findById(id);

    if (!story) {
      return null;
    }

    if (!story.isPublished) {
      return null;
    }

    return story;
  },
};