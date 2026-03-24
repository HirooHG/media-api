import type {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

export function validateData(schema: z.ZodType<any>, field: 'body' | 'query' | 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[field]);

    if (!parsed.success) {
      return res.status(400).json({error: 'Invalid data: ' + parsed.error.message});
    }

    next();
  };
}
