import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${process.env.DATABASE_NAME}`,
        );
        console.log(
            `\n MongoDB Connected successfully !!! DB HOST ${connectionInstance.connection.host}`,
        );
    } catch (error) {
        console.log("MONGO_DB Connection Failed: ", error);
        process.exit(1);
    }
};

export default connectDB;
