import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/index.js";
import { DB, PORT } from "./secrets.js";

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", true);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use("/", routes);

mongoose
  .connect(DB, { dbName: "goodreads" })
  .then(() => {
    app.listen(PORT, () => {
      console.log("CONNECTED");
    });
  })
  .catch(() => console.log("DONNECTED"));
