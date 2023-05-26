import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const carAdapter = createEntityAdapter({
	selectId: (item) => item._id
}); // створює об'єкт функцій для керування стейтом, 

const initialState = carAdapter.getInitialState({  //адаптер створює початковий стейт
	carLoadingStatus: 'idle'
});

export const fetchCar = createAsyncThunk(
	'car/fetchCar',
	async (arg, thunkAPI) => {
		console.log(`arg: ${arg.token}, ${arg.vin}`)
		const res = await fetch(
			process.env.REACT_APP_API_ENDPOINT + `cars/car/${arg.vin}`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${arg.token}`,
			},
		})
		const toSend = await res.json()
		console.log(`single car data: ${toSend}`)
		return [toSend];

	}
)

const carSlice = createSlice({
	name: 'car',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCar.pending, state => { state.carLoadingStatus = 'loading' })
			.addCase(fetchCar.fulfilled, (state, action) => {
				state.carLoadingStatus = 'idle';
				carAdapter.setAll(state, action.payload);
			})
			.addCase(fetchCar.rejected, (state, action) => {
				state.carLoadingStatus = "error";
				console.log(action.payload.errorMessage)
			})

			.addDefaultCase(() => { })
	}
});



const { actions, reducer } = carSlice;

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

export const globalizedSelector = carAdapter.getSelectors(
	(state) => state.car
);

export default carSlice;

export const { carFetching, carFetched, carFetchingError } = carSlice.actions;

