import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/apiError.js";

//  Token generate karne ka function
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token 30 din tak valid rahega
  });
};

//  Token verify karne ka function
const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json(new ApiError(401, "No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded ko request me dal do taaki aage use kar sako
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Invalid token"));
  }
};

const verifyRole = (role) => {
  return (req, res, next) => {
          const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          if(!token) {
            return next(new ApiError(401, "No token provided"));
          }
          if(!decoded) {
            return next(new ApiError(401, "Invalid token"));
          }
          if(!role.includes(decoded.type)) {
             return next(new ApiError(401, "Unauthorized to access this resource"));
          }
          req.user = decoded;
          next();
        }
};

export { generateToken, verifyToken, verifyRole };
