import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const hotelSchema = new Schema(
  {
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Hotel name must be at least 2 characters long"],
      maxlength: [100, "Hotel name must be at most 100 characters long"],
      index: true
    },
    hotelCode: {
      type: String,
      unique: true,
    },
    hotelUsername: {
      type: String,
      unique: [true, "Hotel username must be unique"],
      required: [true, "Hotel username is required"],
    },
    hotelPassword: {
      type: String,
      required: [true, "Password is required"],
    },
    hotelCategory: {
      type: String,
      enum: ["budget", "mid-range", "luxury", "boutique", "resort", "business"],
      default: "mid-range"
    },
    description: { 
      type: String,
      maxlength: [1000, "Description must be at most 1000 characters long"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    hotelNumber: { type: String, required: true },

    //contact person details
    contactPersonName: { type: String },
    contactPersonEmail: { 
        type: String,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
     },
    contactPersonNumber: { type: String },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address must be at most 200 characters long"]
    },
    city: { 
      type: String, 
      required: [true, "City is required"], 
      trim: true,
      index: true 
    },
    state: { 
      type: String, 
      required: [true, "State is required"], 
      trim: true,
      index: true 
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India"
    },
    pinCode: { 
      type: String,
     },
    googleMapLink: { 
      type: String,
      },
    
    // Operating hours
    openingTime: { 
      type: String,
      },
    closingTime: { 
      type: String,
     },
    
    // Hotel features
    facilities: { 
      type: [String], 
      default: [],
      validate: {
        validator: function(facilities) {
          return facilities.length <= 20;
        },
        message: "Maximum 20 facilities allowed"
      }
    },
    hotelLogo: { 
      type: String,
       },
    hotelBanner: { 
      type: String,
      },
    
    // Room and pricing info
    totalRooms: {
      type: Number,
      default: 0,
    },
    priceRange: {
      min: {
        type: Number,
        min: [0, "Minimum price cannot be negative"]
      },
      max: {
        type: Number,
        min: [0, "Maximum price cannot be negative"]
      }
    },

    //financial details
    GSTNumber: { 
      type: String, 
      required: [true, "GST number is required"],
    },
    PANNumber: { 
      type: String,
    },
    ifscCode: { 
      type: String,
    },
    bankName: { 
      type: String,
    },
    bankAccountNumber: { 
      type: String,
    },
    bankAccountHolderName: { 
      type: String,
    },

    paymentPreference: {
      type: String,
      enum: ["upi", "bank transfer", "cash", "card"],
      default: "bank transfer",
    },
    
    //verification details
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true
    },
    verificationNotes: {
      type: String,
    },
    
    // Rating and reviews
    rating: { 
      type: Number, 
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"]
    },
    totalReviews: { 
      type: Number, 
      default: 0,
      min: [0, "Total reviews cannot be negative"]
    },
    
    // Status and dates
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    joinedDate: { 
      type: Date, 
      default: Date.now 
    },
    lastLoginDate: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields
hotelSchema.virtual('fullAddress').get(function() {
  return `${this.address}, ${this.city}, ${this.state} ${this.pinCode}, ${this.country}`;
});

hotelSchema.virtual('operatingHours').get(function() {
  if (this.openingTime && this.closingTime) {
    return `${this.openingTime} - ${this.closingTime}`;
  }
  return '24/7';
});

hotelSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? (this.rating / this.totalReviews).toFixed(1) : 0;
});

//  Pre-save hook -> Hash password before saving
hotelSchema.pre("save", async function (next) {
  if (!this.isModified("hotelPassword")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.hotelPassword = await bcrypt.hash(this.hotelPassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//  Method to compare password
hotelSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.hotelPassword);
};

// Indexes for better performance
hotelSchema.index({ hotelName: 'text', description: 'text' });
hotelSchema.index({ city: 1, state: 1 });
hotelSchema.index({ verificationStatus: 1, isActive: 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ joinedDate: -1 });

// Pre-save middleware
hotelSchema.pre('save', function(next) {
  // Auto-generate hotel code if not provided
  if (!this.hotelCode && this.hotelName) {
    const nameWords = this.hotelName.split(' ').slice(0, 2);
    const code = nameWords.map(word => word.substring(0, 2).toUpperCase()).join('');
    this.hotelCode = code + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }
  
  // Validate price range
  if (this.priceRange && this.priceRange.min && this.priceRange.max) {
    if (this.priceRange.min > this.priceRange.max) {
      return next(new Error('Minimum price cannot be greater than maximum price'));
    }
  }
  
  next();
});

// Pre-update middleware
hotelSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  // Update lastLoginDate when verification status changes
  if (this.getUpdate().verificationStatus === 'approved') {
    this.getUpdate().lastLoginDate = new Date();
  }
  next();
});

// Instance methods
hotelSchema.methods.isVerified = function() {
  return this.verificationStatus === 'approved';
};

hotelSchema.methods.isActiveHotel  = function() {
  return this.isActive && this.verificationStatus === 'approved';
};

hotelSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating * this.totalReviews) + newRating;
  this.totalReviews += 1;
  this.rating = totalRating / this.totalReviews;
  return this.save();
};

// Static methods
hotelSchema.statics.findByLocation = async function (filters = {}) {
    const query = {};
  
    if (filters.city) query.city = filters.city;
    if (filters.state) query.state = filters.state;
    if (filters.pinCode) query.pinCode = filters.pinCode;
    query.isActive = true;
    query.verificationStatus = 'approved';
  
    return this.find(query);
  };

hotelSchema.statics.findByCategory = function(category) {
  return this.find({ hotelCategory: category, isActive: true, verificationStatus: 'approved' });
};

hotelSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'priceRange.min': { $lte: maxPrice },
    'priceRange.max': { $gte: minPrice },
    isActive: true,
    verificationStatus: 'approved'
  });
};

export const Hotel = model("Hotel", hotelSchema);
