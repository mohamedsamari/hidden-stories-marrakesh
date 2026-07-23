import { categoriesService } from './categories.service';
import { categoriesRepository } from '../repositories/categories.repository';

jest.mock('../repositories/categories.repository');

const mockedRepository = categoriesRepository as jest.Mocked<typeof categoriesRepository>;

describe('categoriesService', () => {
  it('getAllCategories delegates to the repository and returns its result', async () => {
    const categories = [{ id: '1', nameEn: 'Palace', nameFr: 'Palais' }] as any;
    mockedRepository.findAll.mockResolvedValue(categories);

    const result = await categoriesService.getAllCategories();

    expect(mockedRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });

  it('createCategory forwards the input data to the repository', async () => {
    const input = { nameEn: 'Garden', nameFr: 'Jardin' };
    const created = { id: '2', ...input } as any;
    mockedRepository.create.mockResolvedValue(created);

    const result = await categoriesService.createCategory(input);

    expect(mockedRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
  });

  it('updateCategory forwards the id and the input data to the repository', async () => {
    const input = { nameEn: 'Updated' };
    mockedRepository.update.mockResolvedValue({ id: '2', nameEn: 'Updated', nameFr: 'Jardin' } as any);

    await categoriesService.updateCategory('2', input);

    expect(mockedRepository.update).toHaveBeenCalledWith('2', input);
  });

  it('deleteCategory forwards the id to the repository', async () => {
    mockedRepository.remove.mockResolvedValue({ id: '2' } as any);

    await categoriesService.deleteCategory('2');

    expect(mockedRepository.remove).toHaveBeenCalledWith('2');
  });

  it('returns null from update/delete when the repository finds nothing', async () => {
    mockedRepository.update.mockResolvedValue(null);
    mockedRepository.remove.mockResolvedValue(null);

    await expect(categoriesService.updateCategory('missing', { nameEn: 'x' })).resolves.toBeNull();
    await expect(categoriesService.deleteCategory('missing')).resolves.toBeNull();
  });
});
