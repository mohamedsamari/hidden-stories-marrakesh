import { dynastiesRepository } from '../repositories/dynasties.repository';
import { CreateDynastyInput, UpdateDynastyInput } from '../validators/dynasty.validator';

export const dynastiesService = {
  async getAllDynasties() {
    return dynastiesRepository.findAll();
  },

  async createDynasty(data: CreateDynastyInput) {
    return dynastiesRepository.create(data);
  },

  async updateDynasty(id: string, data: UpdateDynastyInput) {
    return dynastiesRepository.update(id, data);
  },

  async deleteDynasty(id: string) {
    return dynastiesRepository.remove(id);
  },
};