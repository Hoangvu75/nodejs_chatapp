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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ACCESS_LINK = __importStar(require("./constants/access_link"));
const account_1 = require("./controllers/account");
const chatbox_1 = require("./controllers/chatbox");
const generate_otp_1 = require("./controllers/generate_otp");
const profile_1 = require("./controllers/profile");
const search_phone_1 = require("./controllers/search_phone");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
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
    mongoose_1.default.connect(ACCESS_LINK.DB_CONNECTION_STRINGS, function (err) {
        console.log("Initialization completed.");
        if (err) {
            console.log("Connection error");
            throw err;
        }
    });
}
function setup_get_request() {
    app.get("/", function (_req, res) {
        res.sendFile("./index.html", { root: __dirname });
    });
    // account
    (0, account_1.getAccountData)(app);
    // profile
    (0, profile_1.getAccountProfile)(app);
}
function setup_post_request() {
    // account
    (0, account_1.registerAccount)(app);
    (0, account_1.loginAccount)(app);
    // profile
    (0, profile_1.addAccountProfile)(app);
    // otp_code
    (0, generate_otp_1.generateOtpCode)(app);
    // search
    (0, search_phone_1.searchPhone)(app);
    // chat
    (0, chatbox_1.createChatBox)(app);
    (0, chatbox_1.addChat)(app);
    (0, chatbox_1.getChatBoxList)(app);
    (0, chatbox_1.getChat)(app);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        initate_server();
        setup_database_connection();
        setup_get_request();
        setup_post_request();
    });
}
main();
