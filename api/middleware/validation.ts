import { Request, Response, NextFunction } from 'express';

export function validateRequest(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema && schema.parseAsync) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      }
      next();
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Validation Error',
        errors: error.errors || error.issues
      });
    }
  };
}
