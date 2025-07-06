import { createSlice } from "@reduxjs/toolkit";
import { ReduxStore } from "@/interfaces";
import { USER_ROLE } from "@/constants";


const initialState: ReduxStore["user"] = {
	id: null,
	login: null,
	roleId: USER_ROLE.GUEST,
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
			state.id = action.payload.id;
			state.login = action.payload.login;
			state.roleId = action.payload.roleId;
		},
		logout(state) {
			state.id = initialState.id;
			state.login = initialState.login;
			state.roleId = initialState.roleId;
		}
    },
    // extraReducers: (builder) => {
        // builder
        //     .addCase(getDicesFromDb.fulfilled, (state, action) => {

        //     })
            // .addCase(rollDices.fulfilled, (state, action) => {

            // })
    // }
})

export const {setUser, logout} = UserSlice.actions

export default UserSlice.reducer
