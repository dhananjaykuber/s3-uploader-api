"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.checkAllowedEmail = void 0;
// External dependencies
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Checks if the provided email is allowed.
 *
 * @param email Email to check against the allowed email
 * @returns
 */
const checkAllowedEmail = (email) => {
    return email === process.env.ALLOWED_EMAIL;
};
exports.checkAllowedEmail = checkAllowedEmail;
/**
 * Generates a JWT token for the user.
 *
 * @param user User object containing email and _id
 * @returns Generated JWT token
 */
const generateToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return token;
};
exports.generateToken = generateToken;
