import mongoose,{Schema,model} from "mongoose";

const lmsSchema = new Schema({
    hotelName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    designation: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    isWhatsapp: { type: Boolean, default: false },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    numberOfRooms: { type: String, required: true },
    currentSoftware: { type: String, required: false, trim: true },
    enquiryType: { type: String, enum: ['general', 'meeting', 'other'], required: true ,default: 'general'},
    preferredContactTime: { type: String, required: false, trim: true },
    additionalRequirements: { type: String, required: false, trim: true },
    leadSource: { type: String, required: true, trim: true},
    demoRequested: { type: Boolean, default: false },
    servicesInterested: [{ type: String, trim: true }],
  }, {
    timestamps: true
  });

export const Lms = model("Lms", lmsSchema);