import { Request, Response } from 'express';
import { askAssistant } from '../services/groq-agent.service';
import { transcribeAudio } from '../services/transcription.service';

export const assistantController = {
  async chat(req: Request, res: Response) {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Le champ "message" est requis.' });
      }
      const answer = await askAssistant(message);
      res.status(200).json({ answer });
    } catch (error) {
      console.error('Erreur assistant:', error);
      res
        .status(500)
        .json({ message: 'Une erreur est survenue lors de la génération de la réponse.' });
    }
  },

  async transcribe(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Le fichier audio "audio" est requis.' });
      }
      const text = await transcribeAudio(req.file.buffer, req.file.originalname, req.file.mimetype);
      res.status(200).json({ text });
    } catch (error) {
      console.error('Erreur transcription:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la transcription.' });
    }
  },
};
