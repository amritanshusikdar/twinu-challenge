import mongoose from "mongoose";

export const mongoDB_URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@twinuchallenge.b1p74.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB_URI);

export default mongoose.connection;
