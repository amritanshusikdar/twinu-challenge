"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const upload_route_1 = require("./routes/upload.route");
const errorHandler_utils_1 = require("./utils/errorHandler.utils");
const app = (0, express_1.default)();
// Essential Middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Router Middlewares
app.use("/files", upload_route_1.uploadRouter);
app.use(errorHandler_utils_1.errorHandler);
app.listen(process.env.PORT || 3001, () => console.log("Server up and running!"));
//# sourceMappingURL=index.js.map