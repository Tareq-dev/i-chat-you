const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // frontend url later set korbo
  },
});

// store online users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user online
  socket.on("join", (username) => {
    onlineUsers[username] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // receive message
  socket.on("sendMessage", ({ sender, receiver, text }) => {
    const receiverSocketId = onlineUsers[receiver];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        sender,
        text,
      });
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    for (let user in onlineUsers) {
      if (onlineUsers[user] === socket.id) {
        delete onlineUsers[user];
        break;
      }
    }
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
