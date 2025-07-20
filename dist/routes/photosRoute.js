"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const photoController_1 = require("../controllers/photoController");
const router = express_1.default.Router();
router.post('/upload', uploadMiddleware_1.uploadMiddleware, photoController_1.uploadPhoto);
router.get('/', photoController_1.getPhotos);
router.get('/check/:checksum', photoController_1.checkPhotoExists);
router.post('/batch-check', photoController_1.batchCheckPhotos);
router.get('/by-date', photoController_1.getPhotosByDate);
router.delete('/:photoId', () => { });
exports.default = router;
