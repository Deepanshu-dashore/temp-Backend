import { Hotel } from "../models/hotel.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import  {ApiResponse}  from "../Utils/apiResponse.js";
import { generateToken } from "../middleware/auth.middleware.js";
import { ApiError } from "../Utils/apiError.js";



const createHotel = asyncHandler(async (req, res, next) => {
    const { hotelName, email, hotelNumber, address, city, state, GSTNumber,hotelUsername,hotelPassword } = req.body;
    const isHotelExists = await Hotel.findOne({ hotelUsername });
    if (isHotelExists) {
        return next(new ApiError(400, "Hotel already exists"));
    }
    const hotel = await Hotel.create({ hotelName, email, hotelNumber, address, city, state, GSTNumber,hotelUsername,hotelPassword });

     // Convert mongoose doc to plain object
     const hotelObj = hotel.toObject();

     // Remove sensitive/unwanted fields
     delete hotelObj.hotelPassword;
     delete hotelObj.__v;
     delete hotelObj.hotelUsername;

    res.json(new ApiResponse(201, {hotel:hotelObj}, "Hotel created successfully"));
});

const hotelLogin = asyncHandler(async (req, res, next) => {
    const { hotelUsername, hotelPassword } = req.body;
    const hotel = await Hotel.findOne({ hotelUsername });

    if (!hotel) {
        return next(new ApiError(400, "Hotel not found"));
    }
    const isPasswordCorrect = await hotel.matchPassword(hotelPassword);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Invalid password"));
    }
    const token = generateToken(hotel._id, "hotel");

    // Convert mongoose doc to plain object
    const hotelObj = hotel.toObject();

    // Remove sensitive/unwanted fields
    delete hotelObj.hotelPassword;
    delete hotelObj.__v;
    delete hotelObj.hotelUsername;

    res.json(new ApiResponse(200, { hotel:hotelObj, token }, "Hotel logged in successfully"));
});

const getHotel = asyncHandler(async (req, res, next) => {

    const hotel = await Hotel.findById(req.user.id);

    if (!hotel) {
        return next(new ApiError(400, "Hotel not found"));
    }
     // Convert mongoose doc to plain object
     const hotelObj = hotel.toObject();

     // Remove sensitive/unwanted fields
     delete hotelObj.hotelPassword;
     delete hotelObj.__v;
     delete hotelObj.hotelUsername;

    res.json(new ApiResponse(200, {hotel:hotelObj}, "Hotel fetched successfully"));
});

const getAllHotels = asyncHandler(async (req, res, next) => {
    const hotels = await Hotel.find();

    const hotelObjs = hotels.map(hotel=>{
        const hotelObj = hotel.toObject();
        delete hotelObj.hotelPassword;
        delete hotelObj.__v;
        delete hotelObj.hotelUsername;
        return hotelObj;
    });

    if (!hotels) {
        return next(new ApiError(400, "No hotels found"));
    }
    res.json(new ApiResponse(200, {hotels:hotelObjs}, "All hotels fetched successfully"));
});

const updateHotel = asyncHandler(async (req, res, next) => {

    const hotel = await Hotel.findById(req.user.id);
    if(!hotel){
        return next(new ApiError(400, "Hotel not found"));
    }
    
    // Allowed fields to update
    const allowedFields = [
        "hotelName",
        "email",
        "hotelNumber",
        "address",
        "city",
        "state",
        "GSTNumber",
        "hotelUsername",
        "description",
        "contactPersonName",
        "contactPersonEmail",
        "contactPersonNumber",
        "pinCode",
        "googleMapLink",
        "openingTime",
        "closingTime",
        "facilities",
        "PANNumber",
        "ifscCode",
        "bankName",
        "bankAccountNumber",
        "bankAccountHolderName"
    ];

    const fieldsToUpdate = Object.keys(req.body).filter(field=>allowedFields.includes(field));

    fieldsToUpdate.forEach(field=>{
        hotel[field] = req.body[field];
    });

    await hotel.save();

     // Convert mongoose doc to plain object
     const hotelObj = hotel.toObject();

     // Remove sensitive/unwanted fields
     delete hotelObj.hotelPassword;
     delete hotelObj.__v;
     delete hotelObj.hotelUsername;

    res.json(new ApiResponse(200, {hotel:hotelObj}, "Hotel updated successfully"));
})

const uploadAssets = asyncHandler(async (req, res, next) => {
    const hotel = await Hotel.findById(req.user.id);
    if(!hotel){
        return next(new ApiError(400, "Hotel not found"));
    }
    if(req.files.hotelLogo){
    const hotelLogoPath = `${req.protocol}://${req.get("host")}/uploads/hotel/${req.files.hotelLogo[0].filename}`;
        hotel.hotelLogo = hotelLogoPath;
    }
    if(req.files.hotelBanner){
        const hotelBannerPath = `${req.protocol}://${req.get("host")}/uploads/hotel/${req.files.hotelBanner[0].filename}`;
        hotel.hotelBanner = hotelBannerPath;
    }
    await hotel.save();

     // Convert mongoose doc to plain object
     const hotelObj = hotel.toObject();

     // Remove sensitive/unwanted fields
     delete hotelObj.hotelPassword;
     delete hotelObj.__v;
     delete hotelObj.hotelUsername;

    return res.json(new ApiResponse(201, {hotel:hotelObj}, "Assets added successfully"));
})

export { createHotel , hotelLogin , getHotel , getAllHotels , updateHotel , uploadAssets };

