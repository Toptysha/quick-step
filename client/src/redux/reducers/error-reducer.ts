import { ReduxStore } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReduxStore["error"] = {
	error: ''
}

const ErrorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
		setError(state, action) {
			state.error = action.payload;
		},
		removeError(state) {
			state.error = initialState.error;
		}
    },
    // extraReducers: (builder) => {
    // }
})

export const { setError, removeError } = ErrorSlice.actions

export default ErrorSlice.reducer
