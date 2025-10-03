import {Schema, model} from "mongoose";

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username must be at most 20 characters long"],
        lowercase: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email address",
        },
    },
    password:{
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [20, "Password must be at most 20 characters long"],
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },

},{timestamps: true});

export const User = model("User", userSchema);