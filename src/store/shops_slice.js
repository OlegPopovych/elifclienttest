import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const shopsAdapter = createEntityAdapter({
	selectId: (book) => book._id
}); 

const initialState = shopsAdapter.getInitialState({  
	shopsLoadingStatus: 'idle'
});

export const fetchShops = createAsyncThunk(
	'shops/fetchShops',
	async (arg, thunkAPI) => {
		const res = await fetch(
			process.env.REACT_APP_API_ENDPOINT + "shops/getshops", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const toSend = await res.json()
		return toSend;
	}
)

const shopsSlice = createSlice({
	name: 'shops',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchShops.pending, state => { state.shopsLoadingStatus = 'loading' })
			.addCase(fetchShops.fulfilled, (state, action) => {
				state.shopsLoadingStatus = 'idle';
				shopsAdapter.setAll(state, action.payload);
			})
			.addCase(fetchShops.rejected, (state, action) => {
				state.shopsLoadingStatus = "error";
			})
			.addDefaultCase(() => { })
	}
});

const { actions, reducer } = shopsSlice;

export const globalizedSelectors = shopsAdapter.getSelectors(
	(state) => state.shops
);

export default shopsSlice;

export const { shopsFetching, shopsFetched, shopsFetchingError, shopsCreated, shopsDeleted } = shopsSlice.actions;

