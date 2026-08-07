import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Seuls les fichiers image (jpeg, png, webp, gif) sont autorisés.'));
    }
    cb(null, true);
  },
});

export function uploadSingleImage(req: Request, res: Response, next: NextFunction) {
  upload.single('image')(req, res, (err: unknown) => {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/x-m4a',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
];
const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024;

const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_AUDIO_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Format audio non supporté.'));
    }
    cb(null, true);
  },
});

export function uploadSingleAudio(req: Request, res: Response, next: NextFunction) {
  audioUpload.single('audio')(req, res, (err: unknown) => {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}
