import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
// import { signup } from "../../../backend/src/controllers/auth.controller";
import toast from 'react-hot-toast'
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"



export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data })
      get().connectSocket();
    } catch (e) {
      console.log("Error checking auth", e);
      set({ authUser: null })
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false })
    }
  },
  signup: async (formData) => {
    try {
      set({ isSigningUp: true })
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data })
      //toast
      toast.success("Account created successfully")
      get().connectSocket();
    } catch (e) {
      console.log("Error signing up", e);
      toast.error(e.response.data.message || "Error signing up")
    } finally {
      set({ isSigningUp: false })
    }
  },
  login: async (formData) => {
    try {
      set({ isLoggingIn: true })
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data })
      //toast
      toast.success("Login successful")
      get().connectSocket();
    } catch (e) {
      console.log("Error logging in", e);
      toast.error(e.response.data.message || "Error logging in")
    } finally {
      set({ isLoggingIn: false })
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}))