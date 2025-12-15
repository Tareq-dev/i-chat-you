const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log("Joined room:", conversationId);
    });

    socket.on("send_message", async ({ conversationId, senderId, text }) => {
      const message = await Message.create({
        conversationId,
        senderId,
        text
      });
 
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text
      });

      io.to(conversationId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
