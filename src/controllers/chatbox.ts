import { Chatbox, ChatSchema } from "../models/chatbox";

import * as API_LINK from "../constants/api_link";

export function getChatBoxInfo(app: any) {
  app.get(API_LINK.LINK_GET_CHATBOX, function (req: any, res: any) {
    var userArray = [req.body.user1, req.body.user2];
    userArray.sort();

    Chatbox.findOne({ user: userArray }, function (err: any, chatbox: any) {
      if (err) {
        return res.status(500).send({
          success: false,
          message: `${err}`,
        });
      }
      if (!chatbox) {
        return res.status(404).send({
          success: false,
          message: "Chat not found.",
        });
      }
      // Return the user data in the response
      res.status(200).send({
        success: true,
        chatbox,
      });
    });
  });
}

export function createChatBox(app: any) {
  app.post(API_LINK.LINK_CREATE_CHATBOX, function (req: any, res: any) {
    try {
      var userArray = [req.body.user1, req.body.user2];
      userArray.sort();

      const chatbox = new Chatbox({
        user: userArray,
        chat: [],
      });
      chatbox.save();
      return res.status(200).send({
        success: true,
        message: "Save chatbox successfully",
        chatbox,
      });
    } catch (err) {
      return res.status(500).send({ message: `${err}` });
    }
  });
}

export function addChat(app: any) {
  app.post(API_LINK.LINK_ADD_CHAT, function (req: any, res: any) {
    var userArray = [req.body.user1, req.body.user2];
    userArray.sort();

    Chatbox.findOne({ user: userArray }, (err: any, chatbox: any) => {
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
      chatbox.save((error: any) => {
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
