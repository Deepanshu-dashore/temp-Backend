import multer from "multer";
import path from "path";
import { ApiError } from "../Utils/apiError.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.fieldname === "hotelLogo"||file.fieldname === "hotelBanner"){
            cb(null, "./public/uploads/hotel/");
        }else{
            cb(null, "./public/uploads/");
        }
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only images are allowed!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;