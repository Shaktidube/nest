import { Request } from 'express';
import { join } from 'path';

export const FILE_UPLOAD_PATH = join(__dirname, '..', 'uploads');

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const fileNameEditor = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, filename: string) => void,
) => {
  const newFileName = `${Date.now()}-${file.originalname}`;
  cb(null, newFileName);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, valid: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    cb(new Error('Unsupported file type'), false);
  } else {
    cb(null, true);
  }
};
