import { z } from 'zod';
import { Request, Response } from 'express';
import { validateBody } from './validate.middleware';

const testSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().optional(),
});

function buildRequest(body: unknown): Request {
  return { body } as Request;
}

function buildResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('validateBody', () => {
  it('calls next() and replaces req.body with the parsed data when valid', () => {
    const req = buildRequest({ name: 'Koutoubia', age: 12 });
    const res = buildResponse();
    const next = jest.fn();

    validateBody(testSchema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'Koutoubia', age: 12 });
  });

  it('responds 400 with the validation errors when the body is invalid', () => {
    const req = buildRequest({ age: 12 }); // missing required "name"
    const res = buildResponse();
    const next = jest.fn();

    validateBody(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Données invalides.',
        errors: expect.arrayContaining([expect.objectContaining({ path: 'name' })]),
      }),
    );
  });

  it('rejects a field with the wrong type', () => {
    const req = buildRequest({ name: 'Koutoubia', age: 'not-a-number' });
    const res = buildResponse();
    const next = jest.fn();

    validateBody(testSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
