import express from 'express';
import uploadRoute from './routes/uploadRoute';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', uploadRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
