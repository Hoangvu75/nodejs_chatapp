"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatbox = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mChatSchema = new mongoose_1.default.Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: String, required: true }
});
const mProfile = new mongoose_1.default.Schema({
    account_id: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    avatar: { type: String },
});
const mChatbox = new mongoose_1.default.Schema({
    user: { type: [mProfile], required: true },
    chat: { type: [mChatSchema], required: true }
});
exports.Chatbox = mongoose_1.default.model("chatbox", mChatbox);
