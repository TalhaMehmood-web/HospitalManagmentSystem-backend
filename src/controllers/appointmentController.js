import expressAsyncHandler from "express-async-handler";
import Appointment from "../models/appointmentModel.js";
import generateRandomString from "../utils/idGenerator.js";
import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
export const addAppointment = expressAsyncHandler(async (req, res) => {
    try {
        let { patientId, department, doctorName, appointmentDate, timeSlot, tokenNumber, problemTitle, problemDescription, appointmentStatus, appointmentId } = req.body;

        if (!patientId || !department || !doctorName || !appointmentDate || !timeSlot || !problemTitle || !tokenNumber || !appointmentStatus || !problemTitle) {
            return res.status(400).json({ message: "All Fields are required!!" })
        }
        appointmentId = generateRandomString(5);
        const patient = await Patient.findOne({ patientId: patientId });
        if (!patient) {
            return res.status(404).json({ message: "Incorrect Patient Id" });
        }

        const doctor = await Doctor.findOne({ fullname: doctorName.trim("") })
        if (!doctor) {
            return res.status(404).json({ message: "Doctor Name  not found!!" })
        }
        const findByAppointmentId = await Appointment.findOne({ appointmentId })
        if (findByAppointmentId) {
            return res.status(400).json({ message: "Appointment Id already in use" })
        }
        if (!Number(tokenNumber)) {
            return res.status(400).json({ message: "Token Should be in number" })
        }
        const findTokenNumber = await Appointment.findOne({ tokenNumber })
        if (findTokenNumber) {
            return res.status(400).json({ message: "Token already assigned!!" })
        }


        const appointment = await Appointment.create({
            appointmentId,
            patient: patient._id,
            patientId: patient.patientId,
            doctor: doctor._id,
            doctorName: doctor.fullname,
            department,
            appointmentDate,
            timeSlot,
            tokenNumber,
            problemTitle,
            problemDescription,
            appointmentStatus,
        })
        if (!appointment) {
            return res.status(404).json({ message: "Something went wrong!!" })
        }
        res.status(201).json({ appointment, message: "Appointment Added Successfully" })
    } catch (error) {

        res.status(500).json({ message: error?.message })
    }
})
export const allAppointments = expressAsyncHandler(async (_, res) => {
    try {
        const appointments = await Appointment.find();
        if (!appointments) {
            return res.status(404).json({ message: "Appointments not found!!" })
        }
        res.status(200).json(appointments)
    } catch (error) {
        res.status(500).json({ message: error?.message })
    }
})
export const deleteAppointment = expressAsyncHandler(async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(400).json({ message: "Doctor not found!!" })
        }
        const deletedAppointment = await Appointment.findByIdAndDelete(appointment);
        if (deletedAppointment) {
            return res.status(200).json({ message: "Successfully Deleted" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
export const editAppointment = expressAsyncHandler(async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const fieldsToUpdate = req.body;

        if (!appointmentId) {
            return res.status(400).json({ message: "Nothing To Update" })
        }
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Data not found" })
        }
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { $set: fieldsToUpdate }, { new: true })
        if (!updatedAppointment) {
            return res.status(400).json({ message: "Something went wrong while update" })
        }
        res.status(201).json({ updatedAppointment, message: "Successfully Updated" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
