import express from "express";
import { addDoctor, allDoctors, deleteDoctor, doctorActivity, editDoctor, singleDoctor } from "../controllers/doctorControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();


router.post("/add-doctor", upload.single("picture"), addDoctor)
router.get("/all-doctors", allDoctors);
router.put("/edit-doctor/:doctorId", upload.single("picture"), editDoctor)
router.delete("/delete-doctor/:doctorId", deleteDoctor)
router.get("/single-doctor/:doctorId", singleDoctor)
router.get("/doctor-activity/:doctorId", doctorActivity)
export default router;