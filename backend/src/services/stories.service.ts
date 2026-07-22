import { storiesRepository, StoryFilters, SortOptions } from '../repositories/stories.repository';
import { CreateStoryInput, UpdateStoryInput } from '../validators/story.validator';

export const storiesService = {
  async getAllStories(
    page: number,
    limit: number,
    filters: StoryFilters,
    sort: SortOptions,
  ) {
    const safeLimit = limit > 0 ? limit : 10;
    const safePage = page > 0 ? page : 1;
    const offset = (safePage - 1) * safeLimit;

    return storiesRepository.findAll(safeLimit, offset, filters, sort);
  },

  async getAllStoriesAdmin(
    page: number,
    limit: number,
    filters: StoryFilters,
    sort: SortOptions,
  ) {
    const safeLimit = limit > 0 ? limit : 10;
    const safePage = page > 0 ? page : 1;
    const offset = (safePage - 1) * safeLimit;

    return storiesRepository.findAllAdmin(safeLimit, offset, filters, sort);
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

  // Admin can view drafts, unlike the public getStoryById above.
  async getStoryByIdAdmin(id: string) {
    return storiesRepository.findById(id);
  },

  async createStory(data: CreateStoryInput) {
    return storiesRepository.create(data);
  },

  async updateStory(id: string, data: UpdateStoryInput) {
    return storiesRepository.update(id, data);
  },

  async deleteStory(id: string) {
    return storiesRepository.remove(id);
  },

  async publishStory(id: string) {
    return storiesRepository.setPublished(id, true);
  },

  async unpublishStory(id: string) {
    return storiesRepository.setPublished(id, false);
  },
};