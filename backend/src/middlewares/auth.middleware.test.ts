import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from './auth.middleware';

// Replaces jsonwebtoken's `verify` with a mock we control directly, so we
// never contact the real Kinde JWKS endpoint during tests.
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// jwks-rsa pulls in `jose`, which ships an ESM-only build that Jest can't
// parse (node_modules is left untransformed by default). We never actually
// call getSigningKey in these tests — jwt.verify is mocked directly — so a
// minimal fake is enough to stop the real (broken-under-Jest) module from
// ever loading.
jest.mock('jwks-rsa', () => jest.fn(() => ({ getSigningKey: jest.fn() })));

function buildRequest(authorizationHeader?: string): AuthenticatedRequest {
  return {
    headers: { authorization: authorizationHeader },
  } as AuthenticatedRequest;
}

function buildResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('requireAuth', () => {
  it('rejects with 401 when there is no Authorization header', () => {
    const req = buildRequest(undefined);
    const res = buildResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentification requise.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 401 when the header does not start with "Bearer "', () => {
    const req = buildRequest('Basic abc123');
    const res = buildResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects with 401 when jwt.verify reports an invalid/expired token', () => {
    mockedJwt.verify.mockImplementation((_token, _getKey, _options, callback: any) => {
      callback(new Error('jwt expired'), undefined);
    });

    const req = buildRequest('Bearer some.invalid.token');
    const res = buildResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide ou expiré.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and attaches the decoded payload to req.user for a valid token', () => {
    const decodedPayload = { sub: 'user-123', email: 'admin@example.com' };
    mockedJwt.verify.mockImplementation((_token, _getKey, _options, callback: any) => {
      callback(null, decodedPayload);
    });

    const req = buildRequest('Bearer a.valid.token');
    const res = buildResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toEqual(decodedPayload);
  });
});