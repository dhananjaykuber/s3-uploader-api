"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External dependencies
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Internal dependencies
const index_1 = __importDefault(require("./routes/index"));
const connectDb_1 = __importDefault(require("./utils/connectDb"));
dotenv_1.default.config();
// Initialize app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api', index_1.default);
(0, connectDb_1.default)();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// export default app;
