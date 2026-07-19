/**
 * AVON ServicePro: Enterprise-Grade Authorization & Permission Matrix Helpers
 * Handles the 16 requested roles with specific operational capabilities.
 */

import { UserRole } from '../types';

export function isManager(role: UserRole): boolean {
  return role === 'Workshop Manager' || role === 'DIRECTOR' || (role as string) === 'MANAGER';
}

export function isDocumentationOfficer(role: UserRole): boolean {
  return role === 'Documentation Officer';
}

export function isFullEngineer(role: UserRole): boolean {
  return [
    'Senior Biomedical Engineer',
    'Biomedical Engineer',
    'Senior Service Engineer',
    'Service Engineer',
    'Senior Workshop Engineer',
    'Workshop Engineer',
    'Calibration Engineer',
    'ENGINEER' // backward compatibility prefix
  ].includes(role);
}

export function isSupportTech(role: UserRole): boolean {
  return [
    'Junior Biomedical Engineer',
    'Junior Service Engineer',
    'Junior Workshop Engineer',
    'Technician',
    'Trainee Technician',
    'Trainee Engineer',
    'Intern Technician'
  ].includes(role);
}

export function isAnyEngineerOrTech(role: UserRole): boolean {
  return isFullEngineer(role) || isSupportTech(role) || isManager(role);
}

export function canDecommission(role: UserRole): boolean {
  return role === 'Workshop Manager' || role === 'DIRECTOR';
}

export function canRegister(role: UserRole): boolean {
  return role === 'Workshop Manager' || role === 'Documentation Officer' || role === 'DIRECTOR' || (role as string) === 'MANAGER';
}

export function canCalibrate(role: UserRole): boolean {
  return [
    'Workshop Manager',
    'Senior Biomedical Engineer',
    'Biomedical Engineer',
    'Senior Service Engineer',
    'Service Engineer',
    'Senior Workshop Engineer',
    'Workshop Engineer',
    'Calibration Engineer',
    'ENGINEER',
    'MANAGER'
  ].includes(role);
}

export function canEditServiceTicket(role: UserRole): boolean {
  return isManager(role) || isFullEngineer(role) || isSupportTech(role) || (role as string) === 'ENGINEER' || (role as string) === 'MANAGER';
}

export function canApproveBilling(role: UserRole): boolean {
  return isManager(role) || role === 'DIRECTOR' || (role as string) === 'CUSTOMER' || (role as string) === 'MANAGER';
}
