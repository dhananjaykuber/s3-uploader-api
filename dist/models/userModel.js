"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// External dependencies
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
});
exports.User = mongoose_1.default.model('User', UserSchema);
