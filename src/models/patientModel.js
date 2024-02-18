import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Patient = mongoose.model("Patient", patientSchema)
export default Patient;