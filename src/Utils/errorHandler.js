import { ApiError } from "./apiError.js";

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error("Error Details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
    });

    // Mongoose bad ObjectId
    // if (err.name === 'CastError') {
    //     const message = 'Resource not found';
    //     error = new ApiError(404, message);
    // }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        let message = '';
        
        // Customize messages based on field
        switch (field) {
            case 'userName':
                message = 'Username already exists';
                break;
            case 'email':
                message = 'Email already exists';
                break;
            case 'mobileNumber':
                message = 'Mobile number already exists';
                break;
            case 'organizationName':
                message = 'Organization name already exists';
                break;
            case 'orderId':
                message = 'Order ID already exists';
                break;
            case 'invoiceId':
                message = 'Invoice ID already exists';
                break;
            case 'challanId':
                message = 'Challan ID already exists';
                break;
            default:
                message = `${field} already exists with value: ${value}`;
        }
        
        error = new ApiError(400, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ApiError(400, message);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ApiError(401, message);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ApiError(401, message);
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File size too large. Maximum size is 5MB';
        error = new ApiError(400, message);
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field';
        error = new ApiError(400, message);
    }

    // Default error
    if (!error.status) {
        error.status = 500;
        error.message = 'Internal Server Error';
    }

    // Send error response
    res.status(error.status).json({
        success: false,
        message: error.message,
        data: null,
        errors: error.errors || [],
        status: error.status
    });
};

export { errorHandler }; 