const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});
const chalk = require("chalk");
require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const roomRouter = require("./routes/chatRoomRoutes");
const messageRouter = require("./routes/messageRoutes");
const { failResponse } = require("./helper/responseHelper");
require("./database");

app.use(express.static("public"));
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("join-the-room", (data) => {
    console.log(data);
    console.log("Joined to room " + data.roomId);
    socket.join(data.roomId);
  });
  socket.on("add-message", (data) => {
    console.log(data);
    io.emit("new-message", data);
  });
  socket.on("leave-the-room", (data) => {
    console.log(data);
    console.log("Leaving the room " + data.roomId);
    socket.leave(data.roomId);
  });
});

app.use("/api/v1/room", roomRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
  console.log("Error");
  console.log(err);
  console.log(err.message);
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json(failResponse({ message: err.message }));
  }
  console.log(chalk.red(err));
  res.status(400).json({ message: "Something broke!" });
});

server.listen(3001, () => {
  console.log(chalk.yellow.bold("Connected to server!"));
});
