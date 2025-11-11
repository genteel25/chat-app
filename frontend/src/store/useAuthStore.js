import {create} from "zustand"

export const useAuthStore = create((set) => ({
    authUser: {name: "john", _id: 123, age: 25},
    isLoading: false,
    isLoggedIn: false,
    login: () => {
        console.log("We jus logged in")
        set({isLoading: true})
    }
}))