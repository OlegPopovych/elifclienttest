import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const goodsAdapter = createEntityAdapter({
	selectId: (book) => book._id
});

const initialState = goodsAdapter.getInitialState({
	goodsLoadingStatus: 'idle'
});


export const fetchGoods = createAsyncThunk(
	'goods/fetchGoods',
	async (arg, thunkAPI) => {
		const res = await fetch(
			process.env.REACT_APP_API_ENDPOINT + `goods/getgoods/${arg}goods`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		console.log(res);
		const toSend = await res.json()
		console.log(`shops data: ${toSend}`)
		return toSend;
	}
)

const goodsSlice = createSlice({
	name: 'shops',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGoods.pending, state => { state.goodsLoadingStatus = 'loading' })
			.addCase(fetchGoods.fulfilled, (state, action) => {
				state.goodsLoadingStatus = 'idle';
				goodsAdapter.setAll(state, action.payload);
			})
			.addCase(fetchGoods.rejected, (state, action) => {
				state.goodsLoadingStatus = "error";
			})
			.addDefaultCase(() => { })
	}
});

const { actions, reducer } = goodsSlice;

export const goodsSelector = goodsAdapter.getSelectors(
	(state) => state.goods
);

export default goodsSlice;

export const { goodsFetching, goodsFetched, goodsFetchingError, goodsCreated, goodsDeleted } = goodsSlice.actions;

