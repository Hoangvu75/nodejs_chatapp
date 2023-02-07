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
exports.getAccountData = exports.loginAccount = exports.registerAccount = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = __importDefault(require("../models/account"));
const API_LINK = __importStar(require("../constants/api_link"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
function registerAccount(app) {
    app.post(API_LINK.LINK_AUTHEN_REGISTER, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var username = req.body.username;
        var password = req.body.password;
        if (username.length < 8 || password.length < 8) {
            res.status(406).send({
                success: false,
                message: "Register failed, username and password must be at least 8 characters.",
            });
        }
        else {
            account_1.default.findOne({ username: username }, function (err, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(500).send({
                            message: `${err}`,
                        });
                    }
                    if (account) {
                        return res.status(406).send({
                            success: false,
                            message: "Register failed, this  account is already created.",
                        });
                    }
                    if (!account) {
                        try {
                            const new_account = new account_1.default(req.body);
                            yield new_account.save();
                            return res.status(200).send({
                                success: true,
                                message: "Register successfully",
                                new_account,
                            });
                        }
                        catch (err) {
                            return res.status(500).send({ message: `${err}` });
                        }
                    }
                });
            });
        }
    }));
}
exports.registerAccount = registerAccount;
function loginAccount(app) {
    app.post(API_LINK.LINK_AUTHEN_LOGIN, (req, res) => {
        // find the user with the given username
        account_1.default.findOne({ username: req.body.username }, (err, account) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error on the server.",
                });
            }
            if (!account) {
                return res.status(404).send({
                    success: false,
                    message: "Wrong username or password.",
                });
            }
            // verify the password
            const passwordIsValid = account.password === req.body.password;
            if (!passwordIsValid) {
                return res.status(401).send({
                    success: false,
                    message: "Wrong username or password.",
                });
            }
            // if the username and password are correct, create a JWT
            const token = jsonwebtoken_1.default.sign({ id: account._id }, ACCESS_TOKEN_SECRET, {
                expiresIn: 86400, // expires in 24 hours
            });
            // return the token in the response
            return res.status(200).send({
                success: true,
                message: "Login successfully",
                token,
                account,
            });
        });
    });
}
exports.loginAccount = loginAccount;
function getAccountData(app) {
    app.get(API_LINK.LINK_ACCOUNT_DATA, function (req, res) {
        // Get the token from the request header
        const token = req.headers["authorization"];
        var ObjectId = require("mongodb").ObjectID;
        jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, { complete: true }, function (err) {
            if (err)
                return res.sendStatus(401);
            // Find the user in the database using the decoded token
            const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
            const payload = decoded;
            account_1.default.findOne({ _id: new ObjectId(payload.id) }, function (err, account) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: `${err}`,
                    });
                }
                if (!account) {
                    return res.status(404).send({
                        success: false,
                        message: "Invalid account data.",
                    });
                }
                // Return the user data in the response
                res.status(200).send({
                    success: true,
                    account,
                });
            });
        });
    });
}
exports.getAccountData = getAccountData;
