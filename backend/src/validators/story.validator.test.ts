import { createStorySchema, updateStorySchema } from './story.validator';

const validStory = {
  titleEn: 'The Koutoubia Mosque',
  titleFr: 'La mosquée Koutoubia',
  shortDescriptionEn: 'A landmark mosque.',
  shortDescriptionFr: 'Une mosquée emblématique.',
  fullStoryEn: 'Full story in English.',
  fullStoryFr: 'Histoire complète en français.',
  coverImageUrl: 'https://example.com/koutoubia.jpg',
  categoryId: '11111111-1111-4111-8111-111111111111',
  locationId: '22222222-2222-4222-8222-222222222222',
};

describe('createStorySchema', () => {
  it('accepts a fully valid story', () => {
    const result = createStorySchema.safeParse(validStory);
    expect(result.success).toBe(true);
  });

  it('rejects a story missing a required field', () => {
    const { titleFr, ...incomplete } = validStory;
    const result = createStorySchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid categoryId (not a UUID)', () => {
    const result = createStorySchema.safeParse({ ...validStory, categoryId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields being omitted', () => {
    const result = createStorySchema.safeParse(validStory);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublished).toBeUndefined();
      expect(result.data.century).toBeUndefined();
    }
  });

  it('rejects a titleEn longer than 200 characters', () => {
    const result = createStorySchema.safeParse({ ...validStory, titleEn: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });
});

describe('updateStorySchema', () => {
  it('accepts a single field being updated', () => {
    const result = updateStorySchema.safeParse({ titleEn: 'New title' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty object (nothing to update)', () => {
    const result = updateStorySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects an invalid field even if partial', () => {
    const result = updateStorySchema.safeParse({ categoryId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });
});
