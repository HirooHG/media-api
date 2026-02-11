import type {Request, Response, NextFunction} from 'express';
import {z, ZodError} from 'zod';

export function validateData(schema: z.ZodType<any>, field: 'body' | 'query') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[field]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({error: 'Invalid data'});
      } else {
        res.status(500).json({error: 'Internal Server Error'});
      }
    }
  };
}
