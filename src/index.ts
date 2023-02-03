import express from "express";
import mongoose from "mongoose";
import * as ACCESS_LINK from "./constants/access_link";
import { getAccountData, loginAccount, registerAccount } from "./controllers/account";

const app = express();
app.use(express.json());

function initate_server() {
  const PORT = process.env.PORT || 3000;
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
    res.status(200).send("Hello world!");
  });

  getAccountData(app);
}

function setup_post_request() {
  registerAccount(app);

  loginAccount(app);
}

async function main() {
  initate_server();
  setup_database_connection();
  setup_get_request();
  setup_post_request();
  //
}
main();
