import Router from "express";
import { createRoomType, getAllRoomTypes, updateRoomType, deleteRoomType } from "../controllers/roomType.controller.js";

const router = Router();

router.post("/", createRoomType);
router.get("/", getAllRoomTypes);
router.put("/:id", updateRoomType);
router.delete("/:id", deleteRoomType);

export default router;