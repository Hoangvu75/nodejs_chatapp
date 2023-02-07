"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Profile = new mongoose_1.Schema({
    account_id: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    avatar: { type: String },
});
exports.default = (0, mongoose_1.model)("profile", Profile);
