import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModels from '../models/User';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  // Get auth header
  const authHeader =
    (req.headers.authorization as string) ||
    (req.headers.Authorization as string);
  // If no auth header found
  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract access token from auth header
  const token = authHeader.split(' ')[1];

  // Verify extracted access token
  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const userData = decoded.data.email || decoded.data.phone;
      if (!userData) return res.sendStatus(404);

      // Check for email or phone in database
      let user = await UserModels.findOne({ email: userData });
      if (!user) user = await UserModels.findOne({ phone: userData });
      if (!user) return res.sendStatus(403);
      /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
      req.body.userId = user._id;
      next();
      return false;
    }
  );
  return false;
};
