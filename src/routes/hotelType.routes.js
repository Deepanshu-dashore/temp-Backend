import Router from "express";
import { createhotelType, deletehotelType, getAllhotelTypes, updatehotelType } from "../controllers/hotelType.controller.js";

const router = Router();

router.post("/", createhotelType);
router.get("/", getAllhotelTypes);
router.put("/:id", updatehotelType);
router.delete("/:id", deletehotelType);

export default router;