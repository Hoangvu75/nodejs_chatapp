import express from "express";
import mongoose from "mongoose";
import * as ACCESS_LINK from "./constants/access_link";
import {
  getAccountData,
  loginAccount,
  registerAccount,
} from "./controllers/account";
import { generateOtpCode } from "./controllers/generate_otp";
import { addAccountProfile, getAccountProfile } from "./controllers/profile";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

function initate_server() {
  app.listen(PORT, () => {
    console.log(`Listening to server: ${PORT}\nConnecting to the database...`);
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
    res.status(200).send({ response: "Hello world!" });
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
}

async function main() {
  initate_server();
  setup_database_connection();
  setup_get_request();
  setup_post_request();
}
main();
