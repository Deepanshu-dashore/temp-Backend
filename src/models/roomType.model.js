import { Schema, model } from "mongoose";

const roomTypeSchema = new Schema({
    roomTypeName:{
        type: String,
        required: true,
    }

})

export const RoomType = model("RoomType", roomTypeSchema);