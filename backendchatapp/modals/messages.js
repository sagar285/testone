const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    text: { type: String },
    image: { type: String },
    type: { type: String },
    time: { type: String, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    chatId: { type: ObjectId, ref: "Chat", required: true },
    audio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
