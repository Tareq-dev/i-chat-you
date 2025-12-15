const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      required: true,
      validate: [
        (v) => v.length >= 2,
        "Conversation must have at least 2 participants"
      ]
    },

    lastMessage: {
      text: {
        type: String,
        default: ""
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
