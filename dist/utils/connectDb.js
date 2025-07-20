"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connects to the MongoDB database.
 */
const connectToDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.default = connectToDB;
