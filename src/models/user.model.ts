import { model, Schema } from "mongoose";

interface User {
    username: string;
}

interface File extends User {
    file: string;
}

const schema = new Schema<File>({
    username: { type: String, required: true },
    file: { type: String, required: true },
});

export default model<File>("User", schema);
