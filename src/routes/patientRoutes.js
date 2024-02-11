import express from "express";
import { addPatient } from "../controllers/patientControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();


router.post("/add-patient", upload.single("picture"), addPatient)
export default router;