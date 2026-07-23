import { Request, Response } from 'express';

export const uploadsController = {
  async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  },
};
