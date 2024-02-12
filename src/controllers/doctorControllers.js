import expressAsyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import validator from "validator";
export const addDoctor = expressAsyncHandler(async (req, res) => {
    try {
        const { fullname, email, dateOfBirth, age, experience, specialization, phone, gender, address, detail } = req.body;
        if (
            [fullname, email, dateOfBirth, specialization, phone, gender, address, age, experience].some(field => field?.trim() === "")
        ) {
            return res.status(400).json({ message: "All Fields are required !!" })
        }
        // if ([age, experience].some(field => !isNaN(field) || field === null || field === undefined)) {
        //     return res.status(400).json({ message: "Age or Experience should be in number" })
        // }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Not a valid email format!!" })
        }
        const isDoctorExists = await Doctor.findOne({
            $or: [{ email }, { phone }]
        });
        if (isDoctorExists) {
            return res.status(400).json({ message: "Email or Phone number Already Exists!! " })
        }

        const pictureLocalPath = req.file.path;
        if (!pictureLocalPath) {
            return res.status(400).json({ message: "File path not found!!" })
        }
        const picture = await uploadOnCloudinary(pictureLocalPath);
        const doctor = await Doctor.create({
            fullname,
            email,
            age,
            gender,
            experience,
            picture: picture?.url || "No image",
            dateOfBirth,
            detail,
            specialization,
            phone,
            address

        })
        await doctor.save();
        res.status(201).json({ doctor, message: "Profile Created Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})
export const allDoctors = expressAsyncHandler(async (req, res) => {
    try {
        const { limit = 10, search, age, sort } = req.query;

        const filters = {
            ...search && { fullname: { $regex: search, $options: 'i' } },
            ...age && { age: { $gte: Number(age) } },
        };

        const doctors = await Doctor.find(filters)
            .limit(Number(limit))
            .sort(sort);

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: "Data not found!!" });
        }

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});
export const deleteDoctor = expressAsyncHandler(async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(400).json({ message: "Doctor not found!!" })
        }
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
        if (deletedDoctor) {
            return res.status(200).json({ message: "Successfully Deleted" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})