import { storiesService } from './stories.service';
import { storiesRepository } from '../repositories/stories.repository';

// Replaces the whole repository module with a fake version whose methods
// are jest.fn() mocks — nothing here touches the real database.
jest.mock('../repositories/stories.repository');

const mockedRepository = storiesRepository as jest.Mocked<typeof storiesRepository>;

describe('storiesService.getAllStories (pagination)', () => {
  it('computes the correct offset for a given page and limit', async () => {
    mockedRepository.findAll.mockResolvedValue([]);

    await storiesService.getAllStories(2, 5, {}, {});

    // page 2 with limit 5 should skip the first 5 results
    expect(mockedRepository.findAll).toHaveBeenCalledWith(5, 5, {}, {});
  });

  it('defaults an invalid (zero or negative) page to 1', async () => {
    mockedRepository.findAll.mockResolvedValue([]);

    await storiesService.getAllStories(0, 10, {}, {});
    await storiesService.getAllStories(-3, 10, {}, {});

    expect(mockedRepository.findAll).toHaveBeenNthCalledWith(1, 10, 0, {}, {});
    expect(mockedRepository.findAll).toHaveBeenNthCalledWith(2, 10, 0, {}, {});
  });

  it('defaults an invalid (zero or negative) limit to 10', async () => {
    mockedRepository.findAll.mockResolvedValue([]);

    await storiesService.getAllStories(1, -5, {}, {});

    expect(mockedRepository.findAll).toHaveBeenCalledWith(10, 0, {}, {});
  });

  it('forwards filters and sort options unchanged', async () => {
    mockedRepository.findAll.mockResolvedValue([]);
    const filters = { categoryId: 'cat-1', search: 'jardin' };
    const sort = { sortBy: 'century' as const, order: 'asc' as const };

    await storiesService.getAllStories(1, 10, filters, sort);

    expect(mockedRepository.findAll).toHaveBeenCalledWith(10, 0, filters, sort);
  });
});

describe('storiesService.getStoryById (public — hides drafts)', () => {
  it('returns the story when it is published', async () => {
    const story = { id: '1', isPublished: true } as any;
    mockedRepository.findById.mockResolvedValue(story);

    const result = await storiesService.getStoryById('1');

    expect(result).toEqual(story);
  });

  it('returns null when the story exists but is not published', async () => {
    mockedRepository.findById.mockResolvedValue({ id: '1', isPublished: false } as any);

    const result = await storiesService.getStoryById('1');

    expect(result).toBeNull();
  });

  it('returns null when the story does not exist', async () => {
    mockedRepository.findById.mockResolvedValue(null);

    const result = await storiesService.getStoryById('missing-id');

    expect(result).toBeNull();
  });
});

describe('storiesService.getStoryByIdAdmin (admin — sees drafts)', () => {
  it('returns an unpublished story without filtering it out', async () => {
    const draft = { id: '1', isPublished: false } as any;
    mockedRepository.findById.mockResolvedValue(draft);

    const result = await storiesService.getStoryByIdAdmin('1');

    expect(result).toEqual(draft);
  });
});

describe('storiesService publish/unpublish', () => {
  it('publishStory sets isPublished to true', async () => {
    mockedRepository.setPublished.mockResolvedValue({ id: '1', isPublished: true } as any);

    await storiesService.publishStory('1');

    expect(mockedRepository.setPublished).toHaveBeenCalledWith('1', true);
  });

  it('unpublishStory sets isPublished to false', async () => {
    mockedRepository.setPublished.mockResolvedValue({ id: '1', isPublished: false } as any);

    await storiesService.unpublishStory('1');

    expect(mockedRepository.setPublished).toHaveBeenCalledWith('1', false);
  });
});
