import { Request, Response } from "express";
import Grid from "gridfs-stream";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import database, { mongoDB_URI } from "../database/connect.database";

// -------------------------------------- //
// ---------- Initialization ------------ //
// -------------------------------------- //

let gfs: Grid.Grid;
let gridfsBucket: GridFSBucket;

database.once("open", () => {
    console.log("Connected to MongoDB");

    gfs = Grid(database.db, mongoose.mongo);
    gfs.collection("uploads");

    gridfsBucket = new mongoose.mongo.GridFSBucket(database.db, {
        bucketName: "uploads",
    });
});

database.on("error", (err) => console.log(err));

const storage = new GridFsStorage({
    url: mongoDB_URI,
    file: (req: Request, file) => {
        return {
            filename: file.originalname,
            bucketName: "uploads",
            metadata: req.body,
        };
    },
});

export const upload = multer({ storage });

// ------------------------------------------ //
// ---------- Controller Methods ------------ //
// ------------------------------------------ //

export const uploadFile = async (req: Request, res: Response) => {
    if (!("username" in req.body) || req.body.username.length === 0) {
        await gridfsBucket
            .delete((req.file as any)?.id)
            .catch((err: Error) => console.log(err));
        console.log("File from invalid request discarded.");
        return res.status(400).json({ error: "Field `username` is missing." });
    }

    return res.status(200).json({ message: "Upload Successful!" });
};

export const getAllMetadata = async (req: Request, res: Response) => {
    if (!("username" in req.query)) {
        return res.status(400).json({ error: "Invalid request." });
    }

    const files = await gfs.files
        .find({
            metadata: { username: req.query.username },
        })
        .toArray();

    if (files.length === 0)
        return res
            .status(404)
            .json({ error: "No files uploaded from the selected user." });

    const uploadedFiles: { [key: string]: any } = [];

    files.map((file) => {
        const { metadata, ...rest } = file;

        rest.downloadLink = `https://${req.hostname}/files/download/?username=${file.metadata.username}&filename=${file.filename}`;

        uploadedFiles.push(rest);
    });

    return res.status(200).json({
        username: req.query.username,
        uploadedFiles,
    });
};

export const findAndDownloadFile = async (req: Request, res: Response) => {
    if (!("username" in req.query) || !("filename" in req.query)) {
        return res.status(400).json({ error: "Invalid request." });
    }

    const data = await gfs.files
        .find({ metadata: { username: req.query.username } })
        .toArray();

    if (data.length === 0) {
        return res.status(404).json({ error: "User not found." });
    }

    const username = data[0].metadata.username;

    gfs.files.findOne(
        { filename: req.query.filename, metadata: { username } },
        (err, file) => {
            if (!file || file.length === 0) {
                return res.status(404).json({
                    error: "No such file exists",
                });
            }

            const readstream = gridfsBucket.openDownloadStreamByName(
                file.filename
            );
            return readstream.pipe(res);
        }
    );
    return;
};
