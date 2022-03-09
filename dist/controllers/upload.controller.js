"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndDownloadFile = exports.getAllMetadata = exports.uploadFile = exports.upload = void 0;
const gridfs_stream_1 = __importDefault(require("gridfs-stream"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const connect_database_1 = __importStar(require("../database/connect.database"));
// -------------------------------------- //
// ---------- Initialization ------------ //
// -------------------------------------- //
let gfs;
let gridfsBucket;
connect_database_1.default.once("open", () => {
    console.log("Connected to MongoDB");
    gfs = (0, gridfs_stream_1.default)(connect_database_1.default.db, mongoose_1.default.mongo);
    gfs.collection("uploads");
    gridfsBucket = new mongoose_1.default.mongo.GridFSBucket(connect_database_1.default.db, {
        bucketName: "uploads",
    });
});
connect_database_1.default.on("error", (err) => console.log(err));
const storage = new multer_gridfs_storage_1.GridFsStorage({
    url: connect_database_1.mongoDB_URI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: "uploads",
            metadata: req.body,
        };
    },
});
exports.upload = (0, multer_1.default)({ storage });
// ------------------------------------------ //
// ---------- Controller Methods ------------ //
// ------------------------------------------ //
const uploadFile = async (req, res) => {
    var _a;
    if (!("username" in req.body) || req.body.username.length === 0) {
        await gridfsBucket
            .delete((_a = req.file) === null || _a === void 0 ? void 0 : _a.id)
            .catch((err) => console.log(err));
        console.log("File from invalid request discarded.");
        return res.status(400).json({ error: "Field `username` is missing." });
    }
    return res.status(200).json({ message: "Upload Successful!" });
};
exports.uploadFile = uploadFile;
const getAllMetadata = async (req, res) => {
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
            .status(400)
            .json({ error: "No files uploaded from the selected user." });
    const uploadedFiles = [];
    files.map((file) => {
        const { metadata } = file, rest = __rest(file, ["metadata"]);
        rest.downloadLink = `https://${req.hostname}/files/download/?username=${file.metadata.username}&filename=${file.filename}`;
        uploadedFiles.push(rest);
    });
    return res.status(200).json({
        username: req.query.username,
        uploadedFiles,
    });
};
exports.getAllMetadata = getAllMetadata;
const findAndDownloadFile = async (req, res) => {
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
    gfs.files.findOne({ filename: req.query.filename, metadata: { username } }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                error: "No such file exists",
            });
        }
        const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
        return readstream.pipe(res);
    });
    return;
};
exports.findAndDownloadFile = findAndDownloadFile;
//# sourceMappingURL=upload.controller.js.map