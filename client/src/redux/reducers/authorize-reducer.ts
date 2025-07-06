import { ReduxStore } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReduxStore["authorize"] = {
	loginWindowState: 'close',
}

const AuthorizeSlice = createSlice({
    name: 'authorize',
    initialState,
    reducers: {
		openLogin(state) {
			state.loginWindowState = 'login';
		},
		openRegister(state) {
			state.loginWindowState = 'register';
		},
		closeAuth(state) {
			state.loginWindowState = 'close';
		}
    },
    // extraReducers: (builder) => {

    // }
})

export const { openLogin, openRegister, closeAuth} = AuthorizeSlice.actions

export default AuthorizeSlice.reducer
