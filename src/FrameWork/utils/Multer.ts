import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Only images are allowed'));
  }
  cb(null, true);
};

const fileSizeLimit =  20 * 1024 * 1024; // 10MB

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: fileSizeLimit }
});

export default upload;
