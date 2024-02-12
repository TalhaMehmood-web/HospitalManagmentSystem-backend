import express from "express";
import { addDoctor, allDoctors, deleteDoctor } from "../controllers/doctorControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();


router.post("/add-doctor", upload.single("picture"), addDoctor)
router.get("/all-doctors", allDoctors);
router.delete("/delete-doctor/:doctorId", deleteDoctor)
export default router;