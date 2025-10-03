import mongoose, { Schema,model } from "mongoose";
import { ApiError } from "../Utils/apiError.js";

const roomSchema = new Schema({
    roomName:{
        type: String,
        required: [true,"Room name is required"],
    },
    roomType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
        required: [true,"Room type is required"],
        index: true,
    },
    roomNumber:{
        type: String,
        required: [true,"Room number is required"],
    },
    roomDescription:{
        type: String,
        required: [true,"Room description is required"],
    },
    roomFacilities:{
        type: [{ type:String, enum:["Air Conditioning","Free Wi-Fi","TV","Mini Fridge","Private Bathroom","Balcony","Free Parking", "Breakfast Included"] }],
        required: [true,"Room facilities are required"],
        default: [],
        index: true,
    },
    roomCapacity:{
        type: Number,
        required: [true,"Room capacity is required"],
        index: true,
    },
    bedType:{
        type: String,
        enum: {
            values: ["Single","Double","Queen","King","Twin","Double-Queen","Double-King","Double-Twin"],
            message: "{VALUE} is not a valid bed type",
        },
        required: [true,"Bed type is required"],
        index: true,
    },
    roomImages:{
        type: [String],
    },
    roomPrice:{
        type: {
            hourly: { type: Number, min: 0 },
            daily: { type: Number, required: [true,"Room price is required"], min: 0 },
            _id: false,
        },
        index: true,
    },
    roomStatus:{
        type: String,
        enum: ["available", "unavailable", "maintenance"],
        default: "available",
        required: [true,"Room status is required"],
    },

    //hotel information
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },

    // Varification information 
    roomVerificationStatus:{
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"],
        default: "pending",
    },
    roomVerificationNotes:{
        type: String,
    },
    roomVerificationDate:{
        type: Date,
    },

},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals
roomSchema.virtual("hotelName").get(function() {
    if(this.populated("hotel")&& this.hotel?.hotelName){
        return this.hotel.hotelName;
    }
    return undefined;
});

//index 
roomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ roomVerificationStatus: 1 });
roomSchema.index({ roomStatus: 1 });
roomSchema.index({ "roomPrice.hourly": 1 });
roomSchema.index({ "roomPrice.daily": 1 });
roomSchema.index({ roomName: "text", roomDescription: "text" });



// Instance methods
roomSchema.methods.isVerified = function() {
    return this.roomVerificationStatus === 'approved';
  };

// Pre-save middleware
roomSchema.pre("save", async function(next) {
    if(this.isModified("roomVerificationStatus") && this.roomVerificationStatus === "approved") {
        this.roomVerificationDate = new Date();
    }
    next();
});

// Static methods
roomSchema.statics.findByHotel = function(hotelId) {
    return this.find({ hotel: hotelId });
  };

roomSchema.statics.findByRoomNumber = function(hotelId, roomNumber) {
    if(!hotelId){
        throw new ApiError(404,"hotel Id missing")
    }
    return this.find({ hotel: hotelId, roomNumber: roomNumber });
}

roomSchema.statics.findByRoomType = function(roomTypeId) {
    return this.find({ roomType: roomTypeId });
}

roomSchema.statics.findByRoomCapacity = function(roomCapacity) {
    return this.find({ roomCapacity: roomCapacity });
}

roomSchema.statics.findByBedType = function(bedType) {
    return this.find({ bedType: bedType });
}

export const Room = model("Room", roomSchema);
