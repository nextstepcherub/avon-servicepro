import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  uploadNewVersion,
  downloadVersion,
  downloadLatest,
  deleteDocument
} from '../controllers/document.controller';

const router = Router();

// Secure all routes with authentication
router.use(authenticate);

router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/upload', uploadDocument);
router.post('/:id/version', uploadNewVersion);
router.get('/download/:id', downloadLatest);
router.get('/download-version/:versionId', downloadVersion);
router.delete('/:id', deleteDocument);

export default router;
