import { storyReferencesRepository } from '../repositories/story-references.repository';
import { storiesService } from './stories.service';

export const storyReferencesService = {
  // Returns null if the story doesn't exist or isn't published, so the
  // controller can 404 instead of leaking a draft's references.
  async getReferencesForPublishedStory(storyId: string) {
    const story = await storiesService.getStoryById(storyId);
    if (!story) {
      return null;
    }
    return storyReferencesRepository.findAllByStoryId(storyId);
  },
};
