import mongoose from "mongoose";

export const connectDB = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`MongoDB Connected: ${mongoUrl}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
