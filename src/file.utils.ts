import { Request } from 'express';

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
