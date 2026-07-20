import { storiesRepository } from '../repositories/stories.repository';

export const storiesService = {
  async getAllStories() {
    return storiesRepository.findAll();
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