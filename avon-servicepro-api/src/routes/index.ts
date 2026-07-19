import { Router } from 'express';
import authRoutes from './auth.routes';
import jobRoutes from './job.routes';
import assetRoutes from './asset.routes';
import customerRoutes from './customer.routes';
import kpiRoutes from './kpi.routes';
import orgRoutes from './org.routes';
import auditRoutes from './audit.routes';
import adminRoutes from './admin.routes';
import configRoutes from './config.routes';
import installationRoutes from './installation.routes';
import serviceRequestRoutes from './serviceRequest.routes';
import dashboardRoutes from './dashboard.routes';
import amcRoutes from './amc.routes';
import reportRoutes from './report.routes';
import notificationRoutes from './notification.routes';
import documentRoutes from './document.routes';

const router = Router();

// Map all entities to the versioned API paths
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/assets', assetRoutes);
router.use('/customers', customerRoutes);
router.use('/kpis', kpiRoutes);
router.use('/org', orgRoutes);
router.use('/audits', auditRoutes);
router.use('/admin', adminRoutes);
router.use('/config', configRoutes);
router.use('/installations', installationRoutes);
router.use('/service-requests', serviceRequestRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/amc', amcRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/documents', documentRoutes);

export default router;
