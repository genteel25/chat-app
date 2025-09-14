import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import path from 'path'
import connectDB from './lib/db.js'

const app = express();
const __dirname = path.resolve();
dotenv.config() 

app.use(express.json()) // req.body
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)



if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {    
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })
}).catch((err) => {
    console.log("Failed to connext to MongoDB", err);
    process.exit(1)
})
