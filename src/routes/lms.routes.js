import { Router } from "express";
import { createLmsEntry, getAllLmsEntries, updateLmsEntry, deleteLmsEntry } from "../controllers/lms.controller.js";

const router = Router();

router.post("/", createLmsEntry);
router.get("/", getAllLmsEntries);
router.put("/:id", updateLmsEntry);
router.delete("/:id", deleteLmsEntry);

export default router;