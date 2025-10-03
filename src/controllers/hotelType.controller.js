import { HotelType } from "../models/hotelType.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import  {ApiResponse}  from "../Utils/apiResponse.js";
import { ApiError } from "../Utils/apiError.js";

const createhotelType = asyncHandler(async (req, res, next)=>{
    const { hotelTypeName } = req.body;
    if(!hotelTypeName){
        return next(new ApiError(400, "Hotel type name is required"));
    }
    const ishotelTypeExists = await HotelType.findOne({ hotelTypeName });
    if(ishotelTypeExists){
        return next(new ApiError(400, "hotel type already exists"));
    }
    const hotelType = await HotelType.create({ hotelTypeName });
    res.json(new ApiResponse(201, hotelType, "hotel type created successfully"));
});

const getAllhotelTypes = asyncHandler(async (req, res, next)=>{
    const hotelTypes = await HotelType.find();
    if(!hotelTypes){
        return next(new ApiError(400, "No hotel types found"));
    }
    res.json(new ApiResponse(200, hotelTypes, "All hotel types fetched successfully"));
});

const updatehotelType = asyncHandler(async (req, res, next)=>{
    const { hotelTypeName } = req.body;
    const hotelType = await HotelType.findByIdAndUpdate(req.params.id, { hotelTypeName }, { new: true });
    if(!hotelType){
        return next(new ApiError(400, "Hotel type not found"));
    }
    res.json(new ApiResponse(200, hotelType, "Hotel type updated successfully"));
});

const deletehotelType = asyncHandler(async (req, res, next)=>{
    const hotelType = await HotelType.findByIdAndDelete(req.params.id);
    if(!hotelType){
        return next(new ApiError(400, "Hotel type not found"));
    }
    res.json(new ApiResponse(200, hotelType, "Hotel type deleted successfully"));
});

export { createhotelType, getAllhotelTypes, updatehotelType, deletehotelType };