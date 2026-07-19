import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { BadRequestError } from '../utils/apiError';

export const validateRequest = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((err) => {
            const pathStr = err.path.slice(1).map(x => String(x)).join('.');
            const firstPath = err.path[0] !== undefined ? String(err.path[0]) : '';
            return `${pathStr || firstPath || 'input'}: ${err.message}`;
          })
          .join(', ');
        return next(new BadRequestError(`Validation error: ${errorMessages}`));
      }
      return next(error);
    }
  };
};
