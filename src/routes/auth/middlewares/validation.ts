import type {Request, Response, NextFunction} from 'express';
import {z} from 'zod';
import {errorsSchema} from '../../medias/models/schemas/error-schema';

export function validateData(schema: z.ZodType<any>, field: 'body' | 'query' | 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[field]);

    if (!parsed.success) {
      const parsedError = JSON.parse(parsed.error.message);
      const errors = errorsSchema.parse(parsedError);

      return res
        .status(400)
        .json({
          error: 'Invalid data for ' + field + ': ' + errors.map((v) => v.message).join('; '),
        });
    }

    next();
  };
}
