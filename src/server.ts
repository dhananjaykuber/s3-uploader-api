// External dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Internal dependencies
import routes from './routes/index';
import connectToDB from './utils/connectDb';

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

connectToDB();

export default app;
