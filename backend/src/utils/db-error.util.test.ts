import { Response } from 'express';
import { handleWriteError } from './db-error.util';

function buildResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('handleWriteError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('maps a foreign key violation (23503) to 400', () => {
    const res = buildResponse();

    handleWriteError({ code: '23503', detail: 'categoryId not found' }, res, 'création', "l'histoire");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Référence invalide') }),
    );
  });

  it('maps a unique constraint violation (23505) to 409', () => {
    const res = buildResponse();

    handleWriteError({ code: '23505' }, res, 'création', 'la catégorie');

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Conflit') }));
  });

  it('maps a not-null violation (23502) to 400', () => {
    const res = buildResponse();

    handleWriteError({ code: '23502' }, res, 'création', 'le lieu');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Champ requis manquant') }),
    );
  });

  it('falls back to 500 with a generic message for an unrecognized error', () => {
    const res = buildResponse();

    handleWriteError(new Error('connection refused'), res, 'mise à jour', 'la dynastie');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Une erreur est survenue lors de la mise à jour de la dynastie.',
      }),
    );
  });

  it('uses the default resource label when none is provided', () => {
    const res = buildResponse();

    handleWriteError(new Error('boom'), res, 'suppression');

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Une erreur est survenue lors de la suppression de la ressource.',
      }),
    );
  });
});
