import expressAsyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import Appointment from "../models/appointmentModel.js"
import validator from "validator";
import mongoose from "mongoose";
export const addDoctor = expressAsyncHandler(async (req, res) => {
    try {
        const { fullname, email, dateOfBirth, age, experience, specialization, phone, gender, address, detail } = req.body;
        if (
            !fullname || !email || !dateOfBirth || !specialization || !phone || !gender || !address || !age || !experience
        ) {
            return res.status(400).json({ message: "All Fields are required !!" })
        }
        if ([age, experience].some(field => !Number(field))) {
            return res.status(400).json({ message: "Age and Experience should be in number" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: ` "${email}" \n \n is not a valid email format!!` })
        }
        const isDoctorExists = await Doctor.findOne({
            $or: [{ email }, { phone }]
        });
        if (isDoctorExists) {
            return res.status(400).json({ message: "Email or Phone number Already Exists!! " })
        }

        const pictureLocalPath = req.file?.path;
        if (!pictureLocalPath) {
            return res.status(400).json({ message: "Picture is required" })
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
export const editDoctor = expressAsyncHandler(async (req, res) => {
    try {
        const { doctorId } = req.params;
        const fieldsToUpdate = req.body;

        if (!doctorId) {
            return res.status(400).json({ message: "Nothing To Update" })
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Data not found" })
        }
        if (req.file) {
            const picture = await uploadOnCloudinary(req.file.path);
            fieldsToUpdate.picture = picture?.url || "No Image"
        }


        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, { $set: fieldsToUpdate }, { new: true })
        if (!updatedDoctor) {
            return res.status(400).json({ message: "Something went wrong while update" })
        }
        res.status(201).json({ updatedDoctor, message: "Successfully Updated" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
export const singleDoctor = expressAsyncHandler(async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }
        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
export const doctorActivity = expressAsyncHandler(async (req, res) => {
    try {
        const { doctorId } = req.params;
        if (!doctorId) {
            return res.status(400).json({ message: "Select doctor to view Details" });
        }
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found!!" });
        }
        const activity = await Appointment.aggregate([
            {
                $match: { doctor: new mongoose.Types.ObjectId(doctorId) }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patientDetails"
                }
            },
            {
                $unwind: "$patientDetails"
            },
            {
                $project: {
                    _id: 1,
                    patientName: "$patientDetails.fullname",
                    patientPicture: "$patientDetails.picture",
                    injury: "$problemTitle",
                    visitDate: "$appointmentDate",
                    status: "$appointmentStatus",
                }
            }

        ]);

        res.status(200).json({ activity, doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
