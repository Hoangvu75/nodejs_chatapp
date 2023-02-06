import mongoose, {model} from "mongoose";

const mChatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: String, required: true }
});

export const ChatSchema = mongoose.model("chatSchema", mChatSchema);

const mChatbox = new mongoose.Schema({
  user: { type: [String], required: true },
  chat: { type: [mChatSchema], required: true }
});

export const Chatbox = mongoose.model("chatbox", mChatbox);


