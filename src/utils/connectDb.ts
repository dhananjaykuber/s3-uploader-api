// External dependencies
import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database.
 */
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectToDB;
