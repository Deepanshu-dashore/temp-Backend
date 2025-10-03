import { asyncHandler } from "../Utils/asyncHandler.js";
import  {ApiResponse}  from "../Utils/apiResponse.js";
import { ApiError } from "../Utils/apiError.js";
import { Room } from "../models/room.model.js";

const createRoom = asyncHandler(async(req, res, next) => {
    const { roomName, roomType, roomNumber, roomDescription, roomFacilities, roomCapacity, bedType, roomPrice } = req.body;
    const isRoomExists = await Room.findByRoomNumber( req.user.id, roomNumber );
    if(isRoomExists.length > 0){
        return next(new ApiError(400, "Room already exists"));
    }
    roomPrice.hourly = parseInt(roomPrice.hourly);
    roomPrice.daily = parseInt(roomPrice.daily);
    // const roomImages = req.files.map(file => {
    //     return `${req.protocol}://${req.get("host")}/uploads/rooms/${file.filename}`;
    // });

    const room = await Room.create({ roomName, roomType, roomNumber, roomDescription, roomFacilities, roomCapacity, bedType, roomPrice, hotel: req.user.id });
    res.json(new ApiResponse(201, room, "Room created successfully"));

});

export { createRoom };