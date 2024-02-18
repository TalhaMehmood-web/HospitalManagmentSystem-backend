import express from "express";
import { addPatient, allPatients } from "../controllers/patientControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();


router.post("/add-patient", upload.single("picture"), addPatient)
router.get("/all-patients", allPatients)
export default router;