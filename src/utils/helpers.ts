import jwt from 'jsonwebtoken';

export const checkAllowedEmail = (email: string): boolean => {
    return email === process.env.ALLOWED_EMAIL;
};

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
