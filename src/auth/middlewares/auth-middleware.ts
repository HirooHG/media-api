import jwt, {type JwtPayload} from 'jsonwebtoken';
import type {NextFunction, Request, Response} from 'express';
import {sec} from '../utils/token';
import {userTokenDtoSchema, type UserTokenDto} from '../models/schemas/user-token-schema';

export interface UserRequest extends Request {
  user?: UserTokenDto;
}

export const adminOnly = (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({message: 'Access denied'});
  }

  next();
};

export const auth = (req: UserRequest, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1]; // earer ...

  if (!token) {
    return res.status(401).json({message: 'Token missing'});
  }

  jwt.verify(token, sec, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({message: 'Invalid or expired token'});
    }

    try {
      const user = userTokenDtoSchema.parse(decoded as JwtPayload);
      req.user = user;
    } catch (e) {
      return res.status(403).json({message: 'Invalid token'});
    }

    next();
  });
};
