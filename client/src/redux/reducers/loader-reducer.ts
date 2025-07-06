import { ReduxStore } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";


const initialState: ReduxStore["loader"] = {
	isLoad: true,
}

const LoaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
		openLoader(state) {
			state.isLoad = true;
		},
		closeLoader(state) {
			state.isLoad = false;
		}
    },
    // extraReducers: (builder) => {

    // }
})

export const { openLoader, closeLoader} = LoaderSlice.actions

export default LoaderSlice.reducer
