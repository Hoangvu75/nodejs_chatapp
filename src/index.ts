import express from "express";
import mongoose from "mongoose";
import * as ACCESS_LINK from "./constants/access_link";
import {
  getAccountData,
  loginAccount,
  registerAccount,
} from "./controllers/account";
import {
  addChat,
  createChatBox,
  getChat,
  getChatBoxList,
} from "./controllers/chatbox";
import { generateOtpCode } from "./controllers/generate_otp";
import { addAccountProfile, getAccountProfile } from "./controllers/profile";
import { searchPhone } from "./controllers/search_phone";
import http from 'http';
import { Server } from "socket.io";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;


function initate_server() {
  io.on('connection', (socket) => {
    console.log(`a user connected ${Date().toLocaleString()}`);
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
  server.listen(PORT, () => {
    console.log(`Server listening to: ${PORT}\ `);
  });
}

function setup_database_connection() {
  mongoose.connect(ACCESS_LINK.DB_CONNECTION_STRINGS, function (err) {
    console.log("Initialization completed.");
    if (err) {
      console.log("Connection error");
      throw err;
    }
  });
}

function setup_get_request() {
  app.get("/", function (_req: any, res: any) {
    res.sendFile("./index.html", { root: __dirname });
  });

  // account
  getAccountData(app);

  // profile
  getAccountProfile(app);
}

function setup_post_request() {
  // account
  registerAccount(app);
  loginAccount(app);

  // profile
  addAccountProfile(app);

  // otp_code
  generateOtpCode(app);

  // search
  searchPhone(app);

  // chat
  createChatBox(app);
  addChat(app);
  getChatBoxList(app);
  getChat(app);
}

async function main() {
  initate_server();
  setup_database_connection();
  setup_get_request();
  setup_post_request();
}
main();
