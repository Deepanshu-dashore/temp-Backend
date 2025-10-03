import { Schema, model } from "mongoose";

const hotelTypeSchema = new Schema({
    hotelTypeName:{
        type: String,
        required: true,
    }

})

export const HotelType = model("HotelType", hotelTypeSchema);