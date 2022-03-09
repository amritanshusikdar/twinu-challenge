"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("../controllers/upload.controller");
exports.uploadRouter = express_1.default.Router();
exports.uploadRouter.get("/metadata", upload_controller_1.getAllMetadata);
exports.uploadRouter.get("/download", upload_controller_1.findAndDownloadFile);
exports.uploadRouter.post("/upload", upload_controller_1.upload.single("file"), upload_controller_1.uploadFile);
//# sourceMappingURL=upload.route.js.map