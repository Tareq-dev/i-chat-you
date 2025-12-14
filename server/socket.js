const User = require("./models/User");
const Message = require("./models/Message");

const onlineUsers = {}; // username → socketId

module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("join", async (username) => {
      onlineUsers[username] = socket.id;
      await User.updateOne({ username }, { online: true });

      io.emit("onlineUsers", Object.keys(onlineUsers));
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
      const msg = await Message.create({ sender, receiver, text });

      const receiverSocket = onlineUsers[receiver];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", msg);
      }
    });

    socket.on("disconnect", async () => {
      const user = Object.keys(onlineUsers).find(
        (u) => onlineUsers[u] === socket.id
      );

      if (user) {
        delete onlineUsers[user];
        await User.updateOne({ username: user }, { online: false });
      }
    });
  });
};
