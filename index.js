import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import adminRoutes from "./src/routes/adminRoutes.js"
dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/v1/admin", adminRoutes)
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed !!", error);
    })
