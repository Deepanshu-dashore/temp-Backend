import { RoomType } from "../models/roomType.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import  {ApiResponse}  from "../Utils/apiResponse.js";
import { ApiError } from "../Utils/apiError.js";

const createRoomType = asyncHandler(async (req, res, next)=>{
    const { roomTypeName } = req.body;
    if(!roomTypeName){
        return next(new ApiError(400, "Room type name is required"));
    }
    const isRoomTypeExists = await RoomType.findOne({ roomTypeName });
    if(isRoomTypeExists){
        return next(new ApiError(400, "Room type already exists"));
    }
    const roomType = await RoomType.create({ roomTypeName });
    res.json(new ApiResponse(201, roomType, "Room type created successfully"));
});

const getAllRoomTypes = asyncHandler(async (req, res, next)=>{
    const roomTypes = await RoomType.find();
    if(!roomTypes){
        return next(new ApiError(400, "No room types found"));
    }
    res.json(new ApiResponse(200, roomTypes, "All room types fetched successfully"));
});

const updateRoomType = asyncHandler(async (req, res, next)=>{
    const { roomTypeName } = req.body;
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, { roomTypeName }, { new: true });
    if(!roomType){
        return next(new ApiError(400, "Room type not found"));
    }
    res.json(new ApiResponse(200, roomType, "Room type updated successfully"));
});

const deleteRoomType = asyncHandler(async (req, res, next)=>{
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if(!roomType){
        return next(new ApiError(400, "Room type not found"));
    }
    res.json(new ApiResponse(200, roomType, "Room type deleted successfully"));
});

export { createRoomType, getAllRoomTypes, updateRoomType, deleteRoomType };