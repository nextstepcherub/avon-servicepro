import { BadRequestError } from './apiError';
import { logger } from '../config/logger';

/**
 * Validates parameters supplied to database queries to ensure parameter safety
 * and prevent SQL injection or type confusion.
 */
export function validateSqlParameters(sql: string, params?: any[]): void {
  // Check for obvious unparameterized dynamic concatenation vulnerabilities in SQL string
  const unparameterizedPattern = /VALUES\s*\([^$]*'[^']*'\)/i;
  if (unparameterizedPattern.test(sql) && !sql.includes('$') && !sql.includes('?')) {
    logger.warn(`SQL Parameter Validation Alert: Potential unparameterized query detected: ${sql.slice(0, 100)}`);
  }

  if (!params) {
    return;
  }

  if (!Array.isArray(params)) {
    throw new BadRequestError('SQL parameters must be passed as an array.');
  }

  // Validate parameter values
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    if (param === undefined) {
      // Convert undefined to null for safe binding
      params[i] = null;
      continue;
    }

    if (typeof param === 'string') {
      // Check for dangerous SQL injection patterns in string parameters if they contain raw SQL fragments
      const dangerousSqlPatterns = [
        /;\s*DROP\s+TABLE/i,
        /;\s*DELETE\s+FROM/i,
        /;\s*UPDATE\s+\w+\s+SET/i,
        /;\s*INSERT\s+INTO/i,
        /UNION\s+ALL\s+SELECT/i,
        /UNION\s+SELECT/i,
        /--\s*$/m,
      ];

      for (const pattern of dangerousSqlPatterns) {
        if (pattern.test(param)) {
          logger.security(`SQL Injection attack vector intercepted in parameter [${i}]: "${param}"`, { parameterIndex: i, valueSnippet: param.slice(0, 50) });
          throw new BadRequestError('Invalid input parameter detected by SQL security firewall.');
        }
      }
    }
  }
}

/**
 * Sanitizes and validates table or column names used in dynamic query builders.
 */
export function sanitizeIdentifier(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') {
    throw new BadRequestError('Invalid database identifier');
  }

  // Allow only alphanumeric characters and underscores
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new BadRequestError(`Invalid identifier name: ${identifier}. Identifiers must be alphanumeric.`);
  }

  return identifier;
}
