import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

type UserRequest = Request & { user: { id: string; isAdmin: boolean } };

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.token;

  if (authHeader && typeof authHeader === 'string') {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SEC as string, (err, user) => {
      if (err) {
        res.status(403).json('Token is not valid');
      }

      req = Object.assign(req, { user });

      next();
    });
  } else {
    return res.status(401).json('You are not authenticated');
  }
};

export const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { user, params } = req as UserRequest;

    if (user.id === params.id || user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that!');
    }
  });
};

export const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { user } = req as UserRequest;

    if (user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that!');
    }
  });
};
