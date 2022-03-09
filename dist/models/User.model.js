"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    username: { type: String, required: true },
    file: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("User", schema);
//# sourceMappingURL=user.model.js.map