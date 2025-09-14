import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app = express();
dotenv.config() 

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)



app.listen(process.env.PORT || 3000, () => {    
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})
