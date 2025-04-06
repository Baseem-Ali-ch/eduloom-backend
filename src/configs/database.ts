import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.log("Failed to connect mongoDB", error);
  }
};

export default connectDB;