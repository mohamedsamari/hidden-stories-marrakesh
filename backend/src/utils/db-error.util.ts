import { Response } from 'express';

interface PostgresError {
  code?: string;
  detail?: string;
}

/**
 * Maps common PostgreSQL constraint violation codes to appropriate HTTP
 * responses, falling back to a generic 500 for anything unexpected.
 */
export function handleWriteError(error: unknown, res: Response, action: string, resourceLabel = 'la ressource') {
  const pgError = error as PostgresError;

  if (pgError?.code === '23503') {
    return res.status(400).json({
      message: `Référence invalide : ${pgError.detail ?? 'une entité liée est introuvable.'}`,
    });
  }

  if (pgError?.code === '23505') {
    return res.status(409).json({
      message: `Conflit : ${pgError.detail ?? 'cette ressource existe déjà.'}`,
    });
  }

  if (pgError?.code === '23502') {
    return res.status(400).json({
      message: `Champ requis manquant : ${pgError.detail ?? ''}`,
    });
  }

  console.error(`Erreur lors de la ${action} de ${resourceLabel}:`, error);
  return res.status(500).json({
    message: `Une erreur est survenue lors de la ${action} de ${resourceLabel}.`,
  });
}
