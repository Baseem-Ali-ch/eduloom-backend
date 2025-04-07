import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // Add these options to bypass SRV records
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      directConnection: true
    };
    
    await mongoose.connect(process.env.MONGO_URI as string, options);
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.log("Failed to connect mongoDB", error);
  }
};

export default connectDB;