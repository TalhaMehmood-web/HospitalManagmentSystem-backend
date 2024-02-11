import express from "express";
import { addDoctor, allDoctors } from "../controllers/doctorControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();


router.post("/add-doctor", upload.single("picture"), addDoctor)
router.get("/all-doctors", allDoctors);
export default router;