import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const goodsAdapter = createEntityAdapter({
	selectId: (book) => book._id
}); // створює об'єкт функцій для керування стейтом, 

const initialState = goodsAdapter.getInitialState({  //адаптер створює початковий стейт
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
				// Authorization: `Bearer ${arg}`,
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
		// carCreated: (state, action) => {
		// 	carsAdapter.setOne(state, action.payload);  //функціями з адаптера змінємо стейт
		// },
		// carsDeleted: (state, action) => {
		// 	carAdapter.removeOne(state, action.payload);
		// }
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
				// console.log(action.payload.errorMessage)
			})
			.addDefaultCase(() => { })
	}
});



const { actions, reducer } = goodsSlice;

// const { selectAll } = heroesAdapter.getSelectors(state => state.heroes); // метод getSelectors дає метод selectAll який повертає масив

// export const filteredHeroesSelector = createSelector(
// 	(state) => state.filters.activeFilter, // а ця ц-я теж повертає дан, але зроблема вручну
// 	selectAll, //ф-я взята з адаптера повертає масив даних з стейта state.heroes
// 	(filter, heroes) => {
// 		console.log('heroes: ', heroes);
// 		console.log('initilstate: ',initialState);
// 		if (filter === 'all') {
// 			return heroes;
// 		} else {
// 			return heroes.filter(item => item.element === filter);
// 		}
// 	}
// )

// export default reducer;

export const goodsSelector = goodsAdapter.getSelectors(
	(state) => state.goods
);

export default goodsSlice;

export const { goodsFetching, goodsFetched, goodsFetchingError, goodsCreated, goodsDeleted } = goodsSlice.actions;

