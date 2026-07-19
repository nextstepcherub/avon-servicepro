import { Request, Response } from 'express';
import { configService } from '../services/config.service';
import { asyncHandler } from '../utils/asyncHandler';

// --- SYSTEM SETTINGS ---
export const getSystemSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await configService.getSystemSettings();
  res.status(200).json({
    status: 'success',
    results: settings.length,
    data: { settings },
  });
});

export const updateSystemSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key, value, category } = req.body;
  const setting = await configService.updateSystemSetting(key, value, category);
  res.status(200).json({
    status: 'success',
    message: 'System setting updated successfully.',
    data: { setting },
  });
});

// --- CONFIGURATIONS ---
export const getConfigurations = asyncHandler(async (req: Request, res: Response) => {
  const configurations = await configService.getConfigurations();
  res.status(200).json({
    status: 'success',
    results: configurations.length,
    data: { configurations },
  });
});

export const updateConfiguration = asyncHandler(async (req: Request, res: Response) => {
  const { key, value, type, description, isEncrypted } = req.body;
  const configuration = await configService.updateConfiguration(key, value, type, description, isEncrypted);
  res.status(200).json({
    status: 'success',
    message: 'Configuration value saved successfully.',
    data: { configuration },
  });
});

// --- VERSION CONTROL ---
export const getVersionControlHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await configService.getVersionControlHistory();
  res.status(200).json({
    status: 'success',
    results: history.length,
    data: { history },
  });
});

export const createVersionEntry = asyncHandler(async (req: Request, res: Response) => {
  const entry = await configService.createVersionEntry(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Version control changelog added successfully.',
    data: { entry },
  });
});

export const updateVersionEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await configService.updateVersionEntry(id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Version control entry updated successfully.',
    data: { entry },
  });
});

export const deleteVersionEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await configService.deleteVersionEntry(id);
  res.status(200).json({
    status: 'success',
    message: 'Version control entry deleted successfully.',
  });
});

// --- LOOKUP DATA ---
export const getLookupDataList = asyncHandler(async (req: Request, res: Response) => {
  const { type, isActiveOnly } = req.query;
  const list = await configService.getLookupData({
    type: type as string,
    isActiveOnly: isActiveOnly === 'true',
  });
  res.status(200).json({
    status: 'success',
    results: list.length,
    data: { lookupData: list },
  });
});

export const createLookupItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await configService.createLookupItem(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Lookup data option added successfully.',
    data: { lookupItem: item },
  });
});

export const updateLookupItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await configService.updateLookupItem(id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Lookup data option updated successfully.',
    data: { lookupItem: item },
  });
});

export const deleteLookupItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await configService.deleteLookupItem(id);
  res.status(200).json({
    status: 'success',
    message: 'Lookup data option deleted successfully.',
  });
});
