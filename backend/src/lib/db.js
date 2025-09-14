import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
      const conn =  await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected", conn.connection.host)
    } catch (error) {
        console.error("MongoDB connection failed", error)
        process.exit(1) //1 status code means fail, 0 means success
    }
}

export default connectDB