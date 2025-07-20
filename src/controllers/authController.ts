// External dependencies
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Internal dependencies
import { checkAllowedEmail, generateToken } from '../utils/helpers';
import { User } from '../models/userModel';

/**
 * Handles user registration.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!checkAllowedEmail(email)) {
            return res.status(403).json({ error: 'Email not allowed' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            passwordHash,
        });

        await user.save();

        const token = generateToken({ email: user.email, _id: user._id });

        res.status(201).json({
            success: true,
            token,
            user: {
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Handles user login.
 *
 * @param req Express request object
 * @param res Express response object
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!checkAllowedEmail(email)) {
            return res.status(403).json({ error: 'Email not allowed' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash || ''
        );
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken({ email: user.email, _id: user._id });

        res.status(200).json({
            success: true,
            token,
            user: {
                email: user.email,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
