import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables"
      );
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;