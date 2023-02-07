import mongoose, {model} from "mongoose";

const mChatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: String, required: true }
});

const mProfile = new mongoose.Schema({
  account_id: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  birthday: { type: String, required: true },
  avatar: { type: String },
})

const mChatbox = new mongoose.Schema({
  user: { type: [mProfile], required: true },
  chat: { type: [mChatSchema], required: true }
});

export const Chatbox = mongoose.model("chatbox", mChatbox);


