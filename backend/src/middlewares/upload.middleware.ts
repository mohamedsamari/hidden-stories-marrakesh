import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

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
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Seuls les fichiers image (jpeg, png, webp, gif) sont autorisés.'));
    }
    cb(null, true);
  },
});

// Wraps multer's single-file upload so a rejected file (bad type, too large)
// comes back as a clean JSON 400 instead of Express's default error page.
export function uploadSingleImage(req: Request, res: Response, next: NextFunction) {
  upload.single('image')(req, res, (err: unknown) => {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}
