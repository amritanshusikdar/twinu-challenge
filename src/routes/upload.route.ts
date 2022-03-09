import express, { Router } from "express";
import {
    findAndDownloadFile,
    getAllMetadata,
    upload,
    uploadFile,
} from "../controllers/upload.controller";

export const uploadRouter: Router = express.Router();

uploadRouter.get("/metadata", getAllMetadata);
uploadRouter.get("/download", findAndDownloadFile);
uploadRouter.post("/upload", upload.single("file"), uploadFile);
