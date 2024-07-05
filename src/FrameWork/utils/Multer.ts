import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      cb(null, file.originalname);
     
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowedTypes = ['image', 'video', 'audio'];
  const fileType = file.mimetype.split('/')[0];
  
  if (!allowedTypes.includes(fileType)) {
    return cb(new Error('Only images, videos, and audios are allowed'));
  }
  cb(null, true);
};

const fileSizeLimit =  300 * 1024 * 1024; // 300MB

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: fileSizeLimit }
});

export default upload;
