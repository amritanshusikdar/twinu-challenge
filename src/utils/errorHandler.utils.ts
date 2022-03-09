import { ErrorRequestHandler, NextFunction } from "express";

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req,
    res,
    next: NextFunction
) => {
    if (err.name === "MulterError")
        return res
            .status(400)
            .json({ error: "`file` field in the request is missing." });
    return res.status(400).json({ error: "Invalid request." });
};
