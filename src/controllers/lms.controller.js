import { asyncHandler } from "../Utils/asyncHandler.js";
import  {ApiResponse}  from "../Utils/apiResponse.js";
import { ApiError } from "../Utils/apiError.js";
import { Lms } from "../models/lms.model.js";

const createLmsEntry = asyncHandler(async(req, res, next) => {
    const {hotelName,contactPerson,designation,email,mobile,isWhatsapp,address,city,numberOfRooms,currentSoftware,enquiryType,preferredContactTime,additionalRequirements,leadSource,demoRequested,servicesInterested} = req.body;

    const lmsEntry = await Lms.create({
        hotelName,
        contactPerson,
        designation,
        email,
        mobile,
        isWhatsapp,
        address,
        city,
        numberOfRooms,
        currentSoftware,
        enquiryType,
        preferredContactTime,
        additionalRequirements,
        leadSource,
        demoRequested,
        servicesInterested
    });

    if(!lmsEntry){
        return next(new ApiError(400, "Lms entry not created"));
    }

    res.json(new ApiResponse(201, lmsEntry, "Lms entry created successfully"));
});

const getAllLmsEntries = asyncHandler(async(req, res, next) => {
    const lmsEntries = await Lms.find();
    if(!lmsEntries){
        return next(new ApiError(400, "No lms entries found"));
    }
    res.json(new ApiResponse(200, lmsEntries, "All lms entries fetched successfully"));
});

const updateLmsEntry = asyncHandler(async(req, res, next) => {
    const {hotelName,contactPerson,designation,email,mobile,isWhatsapp,address,city,numberOfRooms,currentSoftware,enquiryType,preferredContactTime,additionalRequirements,leadSource,demoRequested,servicesInterested} = req.body;
    const lmsEntry = await Lms.findByIdAndUpdate(req.params.id, {hotelName,contactPerson,designation,email,mobile,isWhatsapp,address,city,numberOfRooms,currentSoftware,enquiryType,preferredContactTime,additionalRequirements,leadSource,demoRequested,servicesInterested}, {new: true});
    if(!lmsEntry){
        return next(new ApiError(400, "Lms entry not found"));
    }
    res.json(new ApiResponse(200, lmsEntry, "Lms entry updated successfully"));
});

const deleteLmsEntry = asyncHandler(async(req, res, next) => {
    const lmsEntry = await Lms.findByIdAndDelete(req.params.id);
    if(!lmsEntry){
        return next(new ApiError(400, "Lms entry not found"));
    }
    res.json(new ApiResponse(200, lmsEntry, "Lms entry deleted successfully"));
});

export { createLmsEntry, getAllLmsEntries, updateLmsEntry, deleteLmsEntry };
