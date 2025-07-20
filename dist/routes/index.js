"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
// Internal dependencies
const authRoute_1 = __importDefault(require("./authRoute"));
const photosRoute_1 = __importDefault(require("./photosRoute"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use('/auth', authRoute_1.default);
router.use('/photos', authMiddleware_1.authenticateToken, photosRoute_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});
exports.default = router;
