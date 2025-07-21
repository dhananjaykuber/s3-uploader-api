"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
// Internal dependencies
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const mediaController_1 = require("../controllers/mediaController");
const router = express_1.default.Router();
router.post('/upload', uploadMiddleware_1.uploadMiddleware, mediaController_1.uploadMedia);
exports.default = router;
