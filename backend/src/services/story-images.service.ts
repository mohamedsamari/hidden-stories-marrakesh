import { storyImagesRepository } from '../repositories/story-images.repository';
import { storiesService } from './stories.service';
import { CreateStoryImageInput, UpdateStoryImageInput } from '../validators/story-image.validator';

export const storyImagesService = {
  // Returns null if the story doesn't exist or isn't published, so the
  // controller can 404 instead of leaking a draft's images.
  async getImagesForPublishedStory(storyId: string) {
    const story = await storiesService.getStoryById(storyId);
    if (!story) {
      return null;
    }
    return storyImagesRepository.findAllByStoryId(storyId);
  },

  async createStoryImage(data: CreateStoryImageInput) {
    return storyImagesRepository.create(data);
  },

  async updateStoryImage(id: string, data: UpdateStoryImageInput) {
    return storyImagesRepository.update(id, data);
  },

  async deleteStoryImage(id: string) {
    return storyImagesRepository.remove(id);
  },
};
