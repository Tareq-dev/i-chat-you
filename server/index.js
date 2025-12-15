const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const chatSocket = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI || "mongodb://)
    .then(() => { console.log("Mongo baby connected") })
    .catch((err) => console.log("Mongo Error", err));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/conversation", require("./routes/conversation"));
app.use("/api/messages", require("./routes/messages"));



chatSocket(io);

server.listen(5000, () => {
    console.log("Server running on 5000");
});
