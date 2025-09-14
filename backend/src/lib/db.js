import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        const {MONGODB_URL} = process.env;
        if(!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined")
        }
      const conn =  await mongoose.connect(MONGODB_URL) 
        console.log("MongoDB connected", conn.connection.host)
    } catch (error) {
        console.error("MongoDB connection failed", error)
        process.exit(1) //1 status code means fail, 0 means success
    }
}

export default connectDB