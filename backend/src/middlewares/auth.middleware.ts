import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import * as dotenv from 'dotenv';

dotenv.config();

const client = jwksClient({
  jwksUri: `${process.env.KINDE_DOMAIN}/.well-known/jwks`,
});

function getSigningKey(header: jwt.JwtHeader, callback: (err: Error | null, key?: string) => void) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export interface AuthenticatedRequest<P = {}> extends Request<P> {
  user?: jwt.JwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getSigningKey,
    {
      audience: process.env.KINDE_AUDIENCE,
      issuer: process.env.KINDE_DOMAIN,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        console.error('Erreur de vérification du token:', err.message);
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
      }

      req.user = decoded as jwt.JwtPayload;
      next();
    }
  );
}