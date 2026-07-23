import { locationImagesRepository } from '../repositories/location-images.repository';
import { CreateLocationImageInput, UpdateLocationImageInput } from '../validators/location-image.validator';

export const locationImagesService = {
  async getImagesForLocation(locationId: string) {
    return locationImagesRepository.findAllByLocationId(locationId);
  },

  async createLocationImage(data: CreateLocationImageInput) {
    return locationImagesRepository.create(data);
  },

  async updateLocationImage(id: string, data: UpdateLocationImageInput) {
    return locationImagesRepository.update(id, data);
  },

  async deleteLocationImage(id: string) {
    return locationImagesRepository.remove(id);
  },

  async setCoverImage(id: string) {
    return locationImagesRepository.setCover(id);
  },
};
