import express from "express";
import { addAppointment, allAppointments, editAppointment, deleteAppointment } from "../controllers/appointmentController.js";
const router = express.Router();

router.post("/add-appointment", addAppointment)
router.get("/all-appointments", allAppointments)
router.put("/edit-appointment/:appointmentId", editAppointment)
router.delete("/delete-appointment/:appointmentId", deleteAppointment)


export default router;