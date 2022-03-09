import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { uploadRouter } from "./routes/upload.route";
import { errorHandler } from "./utils/errorHandler.utils";

const app = express();

// Essential Middlewares
app.use(cors());
app.use(bodyParser.json());

// Router Middlewares
app.use("/files", uploadRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3001, () =>
    console.log("Server up and running!")
);
