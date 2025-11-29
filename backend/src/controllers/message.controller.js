// import Message from "../models/Message.js"
import cloudinary from "../lib/cloudinary.js"
import User from "../models/User.js"
import Message from "../models/message.js";
import { io, getReceiverSocketId } from "../lib/socket.js";



export const getAllContacts = async (req, res, _) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (e) { }
}

export const getMessagesByUserId = async (req, res, _) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)

    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}

export const sendMessage = async (req, res, _) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(400).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await message.save()

        // todo: send message in real time if usser is online - socket.io

        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
        res.status(201).json(message)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getChatPartners = async (req, res, _) => {
    try {
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId },
                { receiverId: myId },
            ]
        }).sort({ createdAt: 1 })

        const chatPatnerIds = [
            ...new Set(
                messages.map(msg =>
                    msg.senderId.toString() === myId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            )
        ]
        const chatPartners = await User.find({ _id: { $in: chatPatnerIds } }).select("-password")
        res.status(200).json(chatPartners)

    } catch (e) {
        return res.status(500).json({ error: "Internal server error" })
    }
}
