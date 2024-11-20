import { Router } from 'express';
import { upload } from '../lib/storage';
import HttpError from '../helpers/http-error';
import logger from '../lib/logger';

const router = Router();

router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    // If file upload is successful, `req.file` will contain the file info
    if (req.file) {
      const filePath = req.file.path; // The path to the uploaded file
      return res.json({
        message: 'File uploaded successfully',
        filePath,
      });
    } else {
      return HttpError.badRequest(res, 'Failed to upload file');
    }
  } catch (error) {
    logger.error(error);
    return HttpError.internalServerError(res, error);
  }
});

export default router;
