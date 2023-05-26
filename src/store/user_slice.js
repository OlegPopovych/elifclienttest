import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null
};

const userSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		}
	}
});

export const { setUser, removeUser } = userSlice.actions;
export const selectUser = state => state.userSlice.user;

export default userSlice;