import { dynastiesRepository } from '../repositories/dynasties.repository';

export const dynastiesService = {
  async getAllDynasties() {
    return dynastiesRepository.findAll();
  },
};