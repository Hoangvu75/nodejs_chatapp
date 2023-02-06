import jwt, { JwtPayload } from "jsonwebtoken";

import Profile from "../models/profile";
import Account from "../models/account";

import * as API_LINK from "../constants/api_link";

export function searchPhone(app: any) {
  app.post(API_LINK.LINK_SEARCH_PHONE, function (req: any, res: any) {
    Account.findOne(
      { username: req.body.phone },
      function (err: any, account: any) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: `${err}`,
          });
        }
        if (!account) {
          return res.status(404).send({
            success: false,
            message: "Phone number not found.",
          });
        }
        Profile.findOne(
          { account_id: account._id },
          function (err: any, profile: any) {
            if (err) {
              return res.status(500).send({
                success: false,
                message: `${err}`,
              });
            }
            if (!profile) {
              return res.status(404).send({
                success: false,
                message: "Can not find this user.",
              });
            }
            res.status(200).send({
                success: true,
                profile,
            });
          }
        );
      }
    );
  });
}
