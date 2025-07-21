// External dependencies
import mongoose from 'mongoose';

export interface User {
    _id?: string;
    email: string;
    passwordHash?: string;
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
});

export const User = mongoose.model<User>('User', UserSchema);
