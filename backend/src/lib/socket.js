import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL,
        credentials: true,
    },
});

// Apply middleware to our socket
io.use(socketAuthMiddleware);

const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.user.fullName);
    userSocketMap[socket.userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.user.fullName);
        delete userSocketMap[socket.userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };