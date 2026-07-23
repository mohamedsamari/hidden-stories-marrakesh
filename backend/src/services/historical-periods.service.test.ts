import { historicalPeriodsService } from './historical-periods.service';
import { historicalPeriodsRepository } from '../repositories/historical-periods.repository';

jest.mock('../repositories/historical-periods.repository');

const mockedRepository = historicalPeriodsRepository as jest.Mocked<typeof historicalPeriodsRepository>;

describe('historicalPeriodsService', () => {
  it('getAllPeriods delegates to the repository and returns its result', async () => {
    const periods = [{ id: '1', nameEn: 'Almohad period', nameFr: 'Période almohade' }] as any;
    mockedRepository.findAll.mockResolvedValue(periods);

    const result = await historicalPeriodsService.getAllPeriods();

    expect(mockedRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(periods);
  });

  it('createPeriod forwards the input data to the repository', async () => {
    const input = { nameEn: 'Saadian period', nameFr: 'Période saadienne' };
    const created = { id: '2', ...input } as any;
    mockedRepository.create.mockResolvedValue(created);

    const result = await historicalPeriodsService.createPeriod(input);

    expect(mockedRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
  });

  it('updatePeriod forwards the id and the input data to the repository', async () => {
    const input = { nameEn: 'Updated period' };
    mockedRepository.update.mockResolvedValue({ id: '2', nameEn: 'Updated period', nameFr: 'x' } as any);

    await historicalPeriodsService.updatePeriod('2', input);

    expect(mockedRepository.update).toHaveBeenCalledWith('2', input);
  });

  it('deletePeriod forwards the id to the repository', async () => {
    mockedRepository.remove.mockResolvedValue({ id: '2' } as any);

    await historicalPeriodsService.deletePeriod('2');

    expect(mockedRepository.remove).toHaveBeenCalledWith('2');
  });

  it('returns null from update/delete when the repository finds nothing', async () => {
    mockedRepository.update.mockResolvedValue(null);
    mockedRepository.remove.mockResolvedValue(null);

    await expect(historicalPeriodsService.updatePeriod('missing', { nameEn: 'x' })).resolves.toBeNull();
    await expect(historicalPeriodsService.deletePeriod('missing')).resolves.toBeNull();
  });
});
