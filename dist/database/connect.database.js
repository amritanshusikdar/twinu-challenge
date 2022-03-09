"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDB_URI = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoDB_URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@twinuchallenge.b1p74.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose_1.default.connect(exports.mongoDB_URI);
exports.default = mongoose_1.default.connection;
//# sourceMappingURL=connect.database.js.map