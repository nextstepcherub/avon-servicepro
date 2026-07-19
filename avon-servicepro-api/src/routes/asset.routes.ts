import { Router } from 'express';
import { registerAsset, getAssetById, listAssets, updateAsset, deleteAsset } from '../controllers/asset.controller';
import { authenticate, requirePermission } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // Require authentication for assets

router.route('/')
  .post(requirePermission('assets:create'), registerAsset)
  .get(requirePermission('assets:read'), listAssets);

router.route('/:id')
  .get(requirePermission('assets:read'), getAssetById)
  .patch(requirePermission('assets:update'), updateAsset)
  .delete(requirePermission('assets:delete'), deleteAsset);

export default router;
