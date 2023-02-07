"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChat = exports.getChatBoxList = exports.addChat = exports.createChatBox = void 0;
const chatbox_1 = require("../models/chatbox");
const API_LINK = __importStar(require("../constants/api_link"));
function createChatBox(app) {
    app.post(API_LINK.LINK_CREATE_CHATBOX, function (req, res) {
        try {
            var userArray = [req.body.user1, req.body.user2];
            const chatbox = new chatbox_1.Chatbox({
                user: userArray,
                chat: [],
            });
            chatbox.save();
            return res.status(200).send({
                success: true,
                message: "Save chatbox successfully",
                chatbox,
            });
        }
        catch (err) {
            return res.status(500).send({ message: `${err}` });
        }
    });
}
exports.createChatBox = createChatBox;
function addChat(app) {
    app.post(API_LINK.LINK_ADD_CHAT, function (req, res) {
        var userArray = [req.body.user1, req.body.user2];
        chatbox_1.Chatbox.findOne({ user: userArray }, (err, chatbox) => {
            var chat_input = {
                sender: req.body.sender,
                content: req.body.content,
                time: req.body.time,
            };
            var chat = chatbox.chat;
            chat.push(chat_input);
            chatbox.updateOne({
                chat: chat,
            });
            chatbox.save((error) => {
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: `${error}`,
                    });
                }
                res.status(200).send({
                    success: true,
                    chatbox: chatbox,
                });
            });
        });
    });
}
exports.addChat = addChat;
function getChatBoxList(app) {
    app.post(API_LINK.LINK_GET_CHATBOX_LIST, function (req, res) {
        var phone = req.body.phone;
        chatbox_1.Chatbox.find({ 'user.phone': phone }, function (err, chatboxList) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: `${err}`,
                });
            }
            if (!chatboxList) {
                return res.status(404).send({
                    success: false,
                    message: "Chat not found.",
                });
            }
            // Return the user data in the response
            res.status(200).send({
                success: true,
                chatboxList,
            });
        });
    });
}
exports.getChatBoxList = getChatBoxList;
function getChat(app) {
    app.post(API_LINK.LINK_GET_CHAT, function (req, res) {
        var userArray = [req.body.user1, req.body.user2];
        chatbox_1.Chatbox.findOne({ user: userArray }, (err, chatbox) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: `${err}`,
                });
            }
            if (!chatbox) {
                return res.status(500).send({
                    success: false,
                    message: "Chat not found",
                });
            }
            res.status(200).send({
                success: true,
                chatbox: chatbox,
            });
        });
    });
}
exports.getChat = getChat;
