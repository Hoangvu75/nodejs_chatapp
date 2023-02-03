import jwt, { JwtPayload } from "jsonwebtoken";

import Profile from "../models/profile";

import * as API_LINK from "../constants/api_link";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

export function addAccountProfile(app: any) {
  app.post(API_LINK.LINK_ACCOUNT_ADD_PROFILE, async (req: any, res: any) => {
    var name = req.body.name;
    var birthday = req.body.birthday;
    var avatar = req.body.avatar;

    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var account_id = payload.id;

    const new_profile = new Profile({ account_id, name, birthday, avatar });
    await new_profile.save();
    return res.status(200).send({
      success: true,
      message: "Add profile successfully",
      new_profile,
    });
  });
}

export function getAccountProfile(app: any) {
  app.get(API_LINK.LINK_ACCOUNT_GET_PROFILE, function (req: any, res: any) {
    // Get the token from the request header
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var account_id = payload.id;

    jwt.verify(token, ACCESS_TOKEN_SECRET, { complete: true }, function (err) {
      if (err) return res.sendStatus(401);
      // Find the profile in the database using the account id
      Profile.findOne(
        { account_id: account_id },
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
              message: "Invalid account profile.",
            });
          }
          // Return the user data in the response
          res.status(200).send({
            success: true,
            profile,
          });
        }
      );
    });
  });
}
