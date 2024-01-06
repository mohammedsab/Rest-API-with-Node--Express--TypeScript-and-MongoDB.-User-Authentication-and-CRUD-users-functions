import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import comperssion from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

const app = express();
const MONGO_URL =
  "mongodb+srv://mo7ammedsab:rH3j1458367NTk7F@typescriptpro.5rrraig.mongodb.net/?retryWrites=true&w=majority";

app.use(
  cors({
    credentials: true,
  })
);

app.use(comperssion());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
