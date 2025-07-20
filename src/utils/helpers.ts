export const checkAllowedEmail = (email: string): boolean => {
    return email === process.env.ALLOWED_EMAIL;
};
