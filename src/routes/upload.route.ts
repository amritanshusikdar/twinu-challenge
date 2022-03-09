import express, { Router } from "express";
import {
    findAndDownloadFile,
    getAllMetadata,
    upload,
    uploadFile,
} from "../controllers/upload.controller";

export const uploadRouter: Router = express.Router();

uploadRouter.post("/upload", upload.single("file"), uploadFile);
uploadRouter.get("/metadata", getAllMetadata);
uploadRouter.get("/download", findAndDownloadFile);
