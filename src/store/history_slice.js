import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const historyAdapter = createEntityAdapter({
	selectId: (book) => book._id
});

const initialState = historyAdapter.getInitialState({
	historyLoadingStatus: 'idle'
});

export const fetchHistory = createAsyncThunk(
	'history/fetchHistory',
	async (arg, thunkAPI) => {
		const res = await fetch(
			process.env.REACT_APP_API_ENDPOINT + "goods/getorders", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		console.log(res);
		const toSend = await res.json()
		console.log(`history data: ${toSend}`)
		return toSend;
	}
)

const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHistory.pending, state => { state.historyLoadingStatus = 'loading' })
			.addCase(fetchHistory.fulfilled, (state, action) => {
				state.historyLoadingStatus = 'idle';
				historyAdapter.setAll(state, action.payload);
			})
			.addCase(fetchHistory.rejected, (state, action) => {
				state.historyLoadingStatus = "error";
			})
			.addDefaultCase(() => { })
	}
});

const { actions, reducer } = historySlice;

export const historySelectors = historyAdapter.getSelectors(
	(state) => state.history
);

export default historySlice;

export const { historyFetching, historyFetched, historyFetchingError, historyCreated, historyDeleted } = historySlice.actions;

