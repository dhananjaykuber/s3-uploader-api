// External dependencies
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Internal dependencies
import { AuthRequest } from '../types';

/**
 * Middleware to authenticate JWT token.
 *
 * @param req Express request object
 * @param res Express response object
 * @param next Next function to call the next middleware
 */
export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = decoded;

        next();
    });
};
