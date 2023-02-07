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
exports.getAccountProfile = exports.addAccountProfile = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const profile_1 = __importDefault(require("../models/profile"));
const API_LINK = __importStar(require("../constants/api_link"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";
function addAccountProfile(app) {
    app.post(API_LINK.LINK_ACCOUNT_ADD_PROFILE, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var phone = req.body.phone;
        var name = req.body.name;
        var birthday = req.body.birthday;
        var avatar = req.body.avatar;
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var account_id = payload.id;
        const new_profile = new profile_1.default({ account_id, phone, name, birthday, avatar });
        yield new_profile.save();
        return res.status(200).send({
            success: true,
            message: "Add profile successfully",
            new_profile,
        });
    }));
}
exports.addAccountProfile = addAccountProfile;
function getAccountProfile(app) {
    app.get(API_LINK.LINK_ACCOUNT_GET_PROFILE, function (req, res) {
        // Get the token from the request header
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var account_id = payload.id;
        jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, { complete: true }, function (err) {
            if (err)
                return res.sendStatus(401);
            // Find the profile in the database using the account id
            profile_1.default.findOne({ account_id: account_id }, function (err, profile) {
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
            });
        });
    });
}
exports.getAccountProfile = getAccountProfile;
