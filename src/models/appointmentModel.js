import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    patientId: {
        type: String,
        required: true
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    doctorName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    tokenNumber: {
        type: Number,
        required: true
    },
    problemTitle: {
        type: String,
        required: true
    },
    problemDescription: {
        type: String,
    },
    appointmentStatus: {
        type: String,
        enum: ["Active", "Pending", "Completed"],
        default: "Pending"
    }

})
const Appointment = mongoose.model("Appointment", appointmentSchema)
export default Appointment;