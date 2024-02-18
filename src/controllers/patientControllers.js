import asyncHandler from "express-async-handler"
import validator from "validator";
import generateRandomString from "../utils/idGenerator.js";
import Patient from "../models/patientModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const addPatient = asyncHandler(async (req, res) => {
    try {
        const { fullname, email, age, dateOfBirth, gender, phone, address } = req.body;
        if (!fullname || !email || !age || !dateOfBirth || !gender || !phone || !address) {
            return res.status(400).json({ message: "All Fields are required" })
        }
        if ([age, phone].some(field => !Number(field))) {
            return res.status(400).json({ message: "Age and Phone Number should be in Number" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Not a valid email format" })
        }
        const patientExist = await Patient.findOne({
            $or: [{ email }, { phone }]
        })
        if (patientExist) {
            return res.status(400).json({ message: "Email or phone number already exists" })
        }
        const pictureLocalPath = req.file?.path;
        if (!pictureLocalPath) {
            return res.status(400).json({ message: "Picture is required" })
        }
        const picture = await uploadOnCloudinary(pictureLocalPath);
        const patient = await Patient.create({
            patientId: generateRandomString(5),
            fullname,
            email,
            age,
            gender,
            picture: picture?.url || "No image",
            dateOfBirth,
            phone,
            address

        })
        await patient.save();
        res.status(201).json({ patient, message: "Profile Create Successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export const allPatients = asyncHandler(async (_, res) => {
    try {
        const patients = await Patient.find();
        if (!patients || patients.length === 0) {
            return res.status(404).json({ message: "Data not found!!" })
        }
        res.status(201).json(patients)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})