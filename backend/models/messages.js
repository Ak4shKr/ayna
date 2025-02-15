import mongoose from "mongoose";
import User from "./user.js";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ["user", "server"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
