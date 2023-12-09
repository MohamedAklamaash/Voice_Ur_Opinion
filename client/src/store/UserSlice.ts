import { createSlice } from "@reduxjs/toolkit";
import DummyLogo from "../assets/DummyLogo.jpeg";

export interface initState {
    userName: String,
    userProfileUrl: String,
    phoneNumber: String,
    email: String
}
let initialState: initState = {
    userName: "",
    userProfileUrl: DummyLogo,
    phoneNumber: "",
    email: ""
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserName(state: initState, action) {
            state.userName = action.payload;
        },
        setProfileUrl(state: initState, action) {
            state.userProfileUrl = action.payload;
        },
        setPhoneNumber(state: initState, action) {
            state.phoneNumber = action.payload
        },
        setEmail(state: initState, action) {
            state.email = action.payload;
        }
    }
})

export const { setProfileUrl, setUserName, setPhoneNumber, setEmail } = userSlice.actions;

export default userSlice.reducer;