"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    if (err.name === "MulterError")
        return res
            .status(400)
            .json({ error: "`file` field in the request is missing." });
    return res.status(400).json({ error: "Invalid request." });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.utils.js.map