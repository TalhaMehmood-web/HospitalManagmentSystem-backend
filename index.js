import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//------Routes Declaration-------//
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to hospital managment system backend" })
})
app.use("/api/v1/admin", adminRoutes)

//------DB-Connection and App Listener--------//
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed !!", error);
    })
