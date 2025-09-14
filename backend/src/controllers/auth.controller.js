import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateToken } from '../lib/utils.js';

export const signup =async (req, res) => {
    const {fullName, email, password} = req.body;
    try{
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        //Check if email is valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email address"})
        }

        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({message: "Email already exists"})
        }

        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if(newUser) {
            // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        const token =    generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id, 
                fullName: newUser.fullName, 
                email: newUser.email, 
                profilePic: newUser.profilePic,
                token
            })
        }else{
            return res.status(400).json({message: "User not created"})
        }
    } catch(e) {
        console.log("Error in signup controller", e);
        return res.status(500).json({message: "Internal server error"})
    }
}
export const login =async (req, res) => {
    res.send("Login route")
}
export const logout =async (req, res) => {
    res.send("Logout route")
}
