"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
// Internal dependencies
const authRoute_1 = __importDefault(require("./authRoute"));
const mediaRoute_1 = __importDefault(require("./mediaRoute"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use('/auth', authRoute_1.default);
router.use('/media', authMiddleware_1.authenticateToken, mediaRoute_1.default);
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});
exports.default = router;
