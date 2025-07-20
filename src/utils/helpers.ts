// External dependencies
import jwt from 'jsonwebtoken';

/**
 * Checks if the provided email is allowed.
 *
 * @param email Email to check against the allowed email
 * @returns
 */
export const checkAllowedEmail = (email: string): boolean => {
    return email === process.env.ALLOWED_EMAIL;
};

/**
 * Generates a JWT token for the user.
 *
 * @param user User object containing email and _id
 * @returns Generated JWT token
 */
export const generateToken = (user: { email: string; _id: string }): string => {
    const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET!,
        {
            expiresIn: '1d',
        }
    );

    return token;
};
