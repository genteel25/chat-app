import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    // const token = socket.handshake.auth.token;
    // if (!token) {
    //     return next(new Error("Authentication error"));
    // }
    try {
        const token = socket.handshake.headers.cookie?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        if (!token) {
            // console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            // console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            // console.log("Socket connection rejected: User not found");
            return next(new Error("Unauthorized - User Not Found"));
        }
        socket.user = user;
        socket.userId = user._id.toString();
        // console.log("Socket connection accepted for user:", user.fullName, socket.userId);
        next();
    } catch (error) {
        console.log("Socket connection rejected: Authentication error");
        next(new Error("Unauthorized - Authentication error"));
    }
};
