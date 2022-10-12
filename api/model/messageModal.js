const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("./userModal");
const ChatRoom = require("./chatRoomModal");

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Message should have a content!"],
      trim: true,
    },
    sender: {
      type: [String],
      required: [true, "Message should have a sender!"],
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ChatRoom,
      required: [true, "Message should have a chat room!"],
      index: true,
    },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function () {
  this.sort("createdAt");
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
