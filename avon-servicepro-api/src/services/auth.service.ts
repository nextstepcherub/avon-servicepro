import { supabase } from '../config/supabase';
import { userRepository, UserEntity } from '../repositories/user.repository';
import { auditRepository } from '../repositories/audit.repository';
import { UnauthorizedError } from '../utils/apiError';
import { logger } from '../config/logger';

export class AuthService {
  async login(email: string, passwordPlain: string): Promise<{ session: any; userProfile: UserEntity | null }> {
    logger.info(`AuthService: Authenticating credentials for ${email} via Supabase`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: passwordPlain,
    });
    
    if (error || !data.user || !data.session) {
      logger.warn(`AuthService: Authentication failed with Supabase for ${email}: ${error?.message}`);
      throw new UnauthorizedError(error?.message || 'Invalid email address or password');
    }
    
    const userId = data.user.id;
    const userProfile = await userRepository.findById(userId);
    
    if (userProfile) {
      // Log successful audit
      await auditRepository.create({
        timestamp: new Date().toISOString(),
        userId: userProfile.id,
        userName: userProfile.name,
        userRole: userProfile.role,
        action: 'LOGIN',
        remarks: 'Authentication successful via Supabase.',
      });
    }
    
    return {
      session: data.session,
      userProfile,
    };
  }

  async getProfile(userId: string): Promise<UserEntity | null> {
    return userRepository.findById(userId);
  }

  async updateProfile(userId: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    return userRepository.updateProfile(userId, updates);
  }
}

export const authService = new AuthService();
