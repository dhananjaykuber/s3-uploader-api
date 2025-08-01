// External dependencies
import express from 'express';

// Internal dependencies
import { login, register } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

export default router;
