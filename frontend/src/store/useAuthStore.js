import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
// import { signup } from "../../../backend/src/controllers/auth.controller";
import toast from 'react-hot-toast'



export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    signup: async (formData) => {
        try{
            set({isSigningUp:true})
            const res = await axiosInstance.post("/auth/signup", formData);
            set({authUser: res.data})
            //toast
            toast.success("Account created successfully")
        } catch(e) {
            console.log("Error signing up", e);
            toast.error(e.response.data.message || "Error signing up")
        }finally{
            set({isSigningUp:false})
        }
    },
    checkAuth:async () => {
       try{
        const res = await axiosInstance.get("/auth/check");
        set({authUser: res.data})
       } catch(e) {
        console.log("Error checking auth", e);
        set({authUser: null})
       }finally {
        set({isCheckingAuth: false})
       }
    }
}))