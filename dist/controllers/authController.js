"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Internal dependencies
const helpers_1 = require("../utils/helpers");
const userModel_1 = require("../models/userModel");
/**
 * Handles user registration.
 *
 * @param req Express request object
 * @param res Express response object
 */
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(0, helpers_1.checkAllowedEmail)(email)) {
            return res.status(403).json({ error: 'Email not allowed' });
        }
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = new userModel_1.User({
            email,
            passwordHash,
        });
        await user.save();
        const token = (0, helpers_1.generateToken)({ email: user.email, _id: user._id });
        res.status(201).json({
            success: true,
            token,
            user: {
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
/**
 * Handles user login.
 *
 * @param req Express request object
 * @param res Express response object
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(0, helpers_1.checkAllowedEmail)(email)) {
            return res.status(403).json({ error: 'Email not allowed' });
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash || '');
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        user.lastLogin = new Date();
        await user.save();
        const token = (0, helpers_1.generateToken)({ email: user.email, _id: user._id });
        res.status(200).json({
            success: true,
            token,
            user: {
                email: user.email,
                lastLogin: user.lastLogin,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
