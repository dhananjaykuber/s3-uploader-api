// External dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Internal dependencies
import routes from './routes/index';

dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', routes);

mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
