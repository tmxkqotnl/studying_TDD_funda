import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoute from "./routes/productRoute.js";
import { Key } from "./Key.js";

const app = express();
dotenv.config();

// for server
const server = async () => {
  try {
    let connectMongoose = await mongoose.connect(Key, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo is connected");
    app.use(express.json());
    app.use("/api/products", productRoute);

    app.listen(5000, () => {
      console.log("listening port 5000");
    });
    app.use((err, req, res, next) => {
      res.status(500).json({
        message: "PAGE NOT FOUND",
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// for test
const test = async () => {
  try {
    app.use(express.json());
    app.use("/api/products", productRoute);

    app.use((err, req, res, next) => {
      res.status(500).json({
        message: "PAGE NOT FOUND",
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export default app;
export { server, test };
