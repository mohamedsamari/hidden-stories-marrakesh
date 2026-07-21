import { locationsRepository } from '../repositories/locations.repository';

export const locationsService = {
  async getAllLocations() {
    return locationsRepository.findAll();
  },
};