import { locationsRepository } from '../repositories/locations.repository';
import { CreateLocationInput, UpdateLocationInput } from '../validators/location.validator';

export const locationsService = {
  async getAllLocations() {
    return locationsRepository.findAll();
  },

  async createLocation(data: CreateLocationInput) {
    return locationsRepository.create(data);
  },

  async updateLocation(id: string, data: UpdateLocationInput) {
    return locationsRepository.update(id, data);
  },

  async deleteLocation(id: string) {
    return locationsRepository.remove(id);
  },
};