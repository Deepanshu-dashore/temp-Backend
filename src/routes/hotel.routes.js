import Router from "express";
import {
  createHotel,
  getAllHotels,
  getHotel,
  hotelLogin,
  updateHotel,
  uploadAssets,
} from "../controllers/hotel.controller.js";
import { createRoom } from "../controllers/room.controller.js";
import { verifyRole, verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post("/", createHotel);
router.post("/login", hotelLogin);
router.get("/", verifyToken, getHotel);
router.get("/all", verifyToken, getAllHotels);
router.patch("/update-profile", verifyToken, updateHotel);
router.post("/create-room", verifyToken,verifyRole(["hotel"]), createRoom);
router.post("/hotel-assest",verifyToken,
  upload.fields([
    { name: "hotelLogo", maxCount: 1 },
    { name: "hotelBanner", maxCount: 1 },
  ]),uploadAssets
);

export default router;
