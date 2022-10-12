const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("./userModal");

const chatRoomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field should be filled!"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
      ],
      required: [true, "ChatRoom should have participants!"],
    },
    owner: {
      type: String,
      required: [true, "Owner field should be filled!"],
      lowercase: true,
      trim: true,
    },

    isPersonal: {
      type: Boolean,
      default: true,
    },
    photo: { type: String, default: "unknown.png" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

chatRoomSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chatRoom",
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
