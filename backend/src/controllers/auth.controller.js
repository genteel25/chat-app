import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateToken } from '../lib/utils.js';

export const signup =async (req, res) => {
    const {fullName, email, password} = req.body;

    try{ 
        const name = typeof fullName === "string" ? fullName.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const normalizedPassword = typeof password === "string" ? password : "";

        if(!name || !normalizedEmail || !normalizedPassword) {
            return res.status(400).json({message: "All fields are required"})
        }

        if(normalizedPassword.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        //Check if email is valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({message: "Invalid email address"})
        }

        const user = await User.findOne({email: normalizedEmail})
        if(user) {
            return res.status(400).json({message: "Email already exists"})
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10)
        const newUser = new User({
            fullName: name,
            email: normalizedEmail,
            password: hashedPassword
        })
        if(newUser) {
          const savedUser =  await newUser.save();
            const token = generateToken(savedUser._id, res)       
            return res.status(201).json({
                _id: savedUser._id, 
                fullName: savedUser.fullName, 
                email: savedUser.email, 
                profilePic: savedUser.profilePic,
                token
            })
            //Send a welcome email to user
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
