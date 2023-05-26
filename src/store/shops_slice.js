import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const shopsAdapter = createEntityAdapter({
	selectId: (book) => book._id
}); // створює об'єкт функцій для керування стейтом, 

const initialState = shopsAdapter.getInitialState({  //адаптер створює початковий стейт
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
				// Authorization: `Bearer ${arg}`,
			},
		})
		console.log(res);
		const toSend = await res.json()
		console.log(`shops data: ${toSend}`)
		return toSend;
	}
)

const shopsSlice = createSlice({
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
			.addCase(fetchShops.pending, state => { state.shopsLoadingStatus = 'loading' })
			.addCase(fetchShops.fulfilled, (state, action) => {
				state.shopsLoadingStatus = 'idle';
				shopsAdapter.setAll(state, action.payload);
			})
			.addCase(fetchShops.rejected, (state, action) => {
				state.shopsLoadingStatus = "error";
				// console.log(action.payload.errorMessage)
			})
			.addDefaultCase(() => { })
	}
});



const { actions, reducer } = shopsSlice;

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

export const globalizedSelectors = shopsAdapter.getSelectors(
	(state) => state.shops
);

export default shopsSlice;

export const { shopsFetching, shopsFetched, shopsFetchingError, shopsCreated, shopsDeleted } = shopsSlice.actions;

