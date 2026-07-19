import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository, UserEntity } from '../repositories/user.repository';
import { auditRepository } from '../repositories/audit.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { config } from '../config/environment';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/apiError';
import { logger } from '../config/logger';

export class AuthService {
  async register(name: string, email: string, role: string, passwordHash: string, tags: string[], territory?: string, avatarUrl?: string): Promise<Omit<UserEntity, 'passwordHash'>> {
    logger.info(`AuthService: Attempting to register user with email ${email}`);
    
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new BadRequestError('A user with this email address already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordHash, salt);
    
    const user = await userRepository.create({
      name,
      email,
      role,
      tags: JSON.stringify(tags),
      avatarUrl,
      territory,
      passwordHash: hashedPassword,
    });
    
    // Log audit action
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: 'SYSTEM',
      userName: 'Identity Provider',
      userRole: 'System Admin',
      action: 'USER_REGISTERED',
      newValue: user.id,
      remarks: `Successfully registered profile for ${user.name} as ${user.role}`,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, passwordPlain: string): Promise<{ token: string; accessToken: string; refreshToken: string; user: Omit<UserEntity, 'passwordHash'> }> {
    logger.info(`AuthService: Authenticating credentials for ${email}`);
    
    const user = await userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`AuthService: Authentication failed, user not found for email ${email}`);
      throw new UnauthorizedError('Invalid email address or password');
    }
    
    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      logger.warn(`AuthService: Authentication failed, invalid password for ${email}`);
      throw new UnauthorizedError('Invalid email address or password');
    }
    
    const tagsArray = JSON.parse(user.tags) as string[];
    
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tags: tagsArray,
    };
    
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    } as jwt.SignOptions);

    const refreshPayload = { id: user.id };
    const refreshToken = jwt.sign(refreshPayload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpire,
    } as any);

    let expiresDays = 7;
    if (config.jwtRefreshExpire.endsWith('d')) {
      expiresDays = parseInt(config.jwtRefreshExpire, 10) || 7;
    } else if (config.jwtRefreshExpire.endsWith('h')) {
      expiresDays = (parseInt(config.jwtRefreshExpire, 10) || 168) / 24;
    }
    const expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate() + expiresDays);

    await refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAtDate.toISOString(),
    });
    
    // Log successful audit
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN',
      remarks: `Authentication successful. Created JWT token expiring in ${config.jwtExpire}`,
    });
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, accessToken: token, refreshToken, user: userWithoutPassword };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info('AuthService: Attempting to rotate tokens using refresh token');

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    // 1. Find token in repository
    const tokenRecord = await refreshTokenRepository.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid, expired, or revoked refresh token');
    }

    // 2. Verify JWT signature of the refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (err) {
      await refreshTokenRepository.revoke(refreshToken);
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (decoded.id !== tokenRecord.userId) {
      throw new UnauthorizedError('Refresh token owner mismatch');
    }

    // 3. Find user
    const user = await userRepository.findById(tokenRecord.userId);
    if (!user) {
      throw new NotFoundError('User profile associated with this session no longer exists');
    }

    // 4. Generate brand new tokens
    const tagsArray = JSON.parse(user.tags) as string[];
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tags: tagsArray,
    };

    const newAccessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    } as any);

    const refreshPayload = { id: user.id };
    const newRefreshToken = jwt.sign(refreshPayload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpire,
    } as any);

    // 5. Revoke the old refresh token
    await refreshTokenRepository.revoke(refreshToken);

    // 6. Save the new refresh token
    let expiresDays = 7;
    if (config.jwtRefreshExpire.endsWith('d')) {
      expiresDays = parseInt(config.jwtRefreshExpire, 10) || 7;
    } else if (config.jwtRefreshExpire.endsWith('h')) {
      expiresDays = (parseInt(config.jwtRefreshExpire, 10) || 168) / 24;
    }
    const expiresAtDate = new Date();
    expiresAtDate.setDate(expiresAtDate.getDate() + expiresDays);

    await refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: expiresAtDate.toISOString(),
    });

    // 7. Audit log the rotation
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'TOKEN_REFRESH',
      remarks: 'Successfully refreshed and rotated session tokens',
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string, userId?: string): Promise<void> {
    logger.info(`AuthService: Terminating session / logging out.`);
    if (refreshToken) {
      await refreshTokenRepository.revoke(refreshToken);
    }

    if (userId) {
      const user = await userRepository.findById(userId);
      if (user) {
        await auditRepository.create({
          timestamp: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'LOGOUT',
          remarks: 'User logged out and refresh session terminated',
        });
      }
    }
  }

  async impersonate(userId: string, requestingAdminId: string): Promise<{ token: string; user: Omit<UserEntity, 'passwordHash'> }> {
    logger.info(`AuthService: Admin ${requestingAdminId} requesting impersonation of user ${userId}`);
    
    const admin = await userRepository.findById(requestingAdminId);
    if (!admin || (admin.role !== 'System Admin' && admin.role !== 'Admin')) {
      throw new UnauthorizedError('Only Administrators can perform profile impersonation');
    }
    
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Target impersonation user profile not found');
    }
    
    const tagsArray = JSON.parse(user.tags) as string[];
    
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tags: tagsArray,
    };
    
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: '2h', // Shorter expiration for impersonated sessions
    });
    
    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId: admin.id,
      userName: admin.name,
      userRole: admin.role,
      action: 'IMPERSONATE_USER',
      previousValue: admin.id,
      newValue: user.id,
      remarks: `Admin ${admin.name} established impersonated workspace session as ${user.name} (${user.role})`,
    });
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}

export const authService = new AuthService();
