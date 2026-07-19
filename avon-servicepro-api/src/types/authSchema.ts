// ============================================================================
// File: src/types/authSchema.ts
// Sprint 1.2 Enterprise Authentication & RBAC Schema for AVON ServicePro
// Database Tables: auth.users, user_profiles, roles, user_roles, engineer_tags, user_engineer_tags
// ============================================================================

export interface DBAuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  is_verified?: boolean;
}

export interface DBUserProfile {
  id: string;
  user_id: string;
  employee_number: string;
  full_name: string;
  department: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  updated_at: string;
}

export interface DBRole {
  id: string;
  role_name: string;
  role_code: string;
  description: string;
  hierarchy_level: number;
}

export interface DBUserRole {
  user_id: string;
  role_id: string;
  assigned_at: string;
}

export interface DBEngineerTag {
  id: string;
  tag_name: string;
  color_code: string; // Tailwind bg/text color or Hex
  category: 'Territory' | 'Specialty' | 'Certification' | 'SLA';
  description?: string;
}

export interface DBUserEngineerTag {
  user_id: string;
  tag_id: string;
  assigned_at: string;
}

// Composite Session Loaded object required by Sprint 1.2
export interface LoadedUserSession {
  user: DBAuthUser;
  profile: DBUserProfile;
  roles: DBRole[];
  engineerTags: DBEngineerTag[];
  isAuthenticated: boolean;
  sessionExpiresAt: number;
}

export interface AuthErrorResponse {
  code: string;
  message: string;
  details?: any;
}
