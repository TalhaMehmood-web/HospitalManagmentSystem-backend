import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        if (connectionInstance) {
            console.log("MongoDB Connected");
        }
    } catch (error) {
        console.log(`Connection Error!! : ${error}`);
        process.exit(1)
    }
}
export default connectDB;