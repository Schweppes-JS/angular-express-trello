import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import * as userController from "./controllers/users";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is up");
});

app.post("/api/users", userController.register);
app.post("/api/users/login", userController.login);

io.on("connection", () => {
  console.log("connected");
});

mongoose.connect("mongodb://localhost:27017/mongodb").then(() => {
  console.log("databes is connected");

  httpServer.listen(4001, () => {
    console.log("listening on port 4001");
  });
});
