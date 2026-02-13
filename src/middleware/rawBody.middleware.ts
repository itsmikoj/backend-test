
import express, { Request, Response, NextFunction } from 'express';

export const conditionalRawBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/v2/webhooks/superwall') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
};