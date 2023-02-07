import { Schema, model } from 'mongoose';


const Profile = new Schema({
    account_id: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    avatar: { type: String },
})

export default model("profile", Profile);