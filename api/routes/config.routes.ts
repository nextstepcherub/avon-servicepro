import { Router } from 'express';
import {
  getSystemSettings,
  updateSystemSetting,
  getConfigurations,
  updateConfiguration,
  getVersionControlHistory,
  createVersionEntry,
  updateVersionEntry,
  deleteVersionEntry,
  getLookupDataList,
  createLookupItem,
  updateLookupItem,
  deleteLookupItem,
} from '../controllers/config.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  updateSystemSettingSchema,
  updateConfigurationSchema,
  createVersionEntrySchema,
  updateVersionEntrySchema,
  createLookupItemSchema,
  updateLookupItemSchema,
} from '../validators/config.validator';

const router = Router();

// Protect all configuration-related routes
router.use(authenticate);

// --- SYSTEM SETTINGS ---
router.get('/settings', getSystemSettings);
router.post('/settings', requireRole(['Admin', 'System Admin']), validateRequest(updateSystemSettingSchema), updateSystemSetting);

// --- CONFIGURATIONS ---
router.get('/configurations', getConfigurations);
router.post('/configurations', requireRole(['Admin', 'System Admin']), validateRequest(updateConfigurationSchema), updateConfiguration);

// --- VERSION CONTROL ---
router.route('/versions')
  .get(getVersionControlHistory)
  .post(requireRole(['Admin', 'System Admin']), validateRequest(createVersionEntrySchema), createVersionEntry);

router.route('/versions/:id')
  .patch(requireRole(['Admin', 'System Admin']), validateRequest(updateVersionEntrySchema), updateVersionEntry)
  .delete(requireRole(['Admin', 'System Admin']), deleteVersionEntry);

// --- LOOKUP DATA ---
router.route('/lookups')
  .get(getLookupDataList)
  .post(requireRole(['Admin', 'System Admin']), validateRequest(createLookupItemSchema), createLookupItem);

router.route('/lookups/:id')
  .patch(requireRole(['Admin', 'System Admin']), validateRequest(updateLookupItemSchema), updateLookupItem)
  .delete(requireRole(['Admin', 'System Admin']), deleteLookupItem);

export default router;
