import { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import { uploadImageToSupabase } from '../lib/storage';

export const uploadsController = {
  async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    try {
      const uniqueName = `${crypto.randomUUID()}${path.extname(req.file.originalname)}`;
      const url = await uploadImageToSupabase(
        req.file.buffer,
        uniqueName,
        req.file.mimetype
      );

      res.status(201).json({ url });
    } catch (err) {
      console.error('Erreur upload Supabase:', err);
      res.status(500).json({ message: "Échec de l'upload de l'image." });
    }
  },
};