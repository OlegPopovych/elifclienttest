import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from './user_slice';

import SliceShops from "./shops_slice";
import GoodsSlice from "./goods_slice";

import useCarSlice from "./car_slice";
import cartSliceReducer from './cart_slice';

const store = configureStore({
	reducer: {
		userSlice: userSliceReducer.reducer,

		shops: SliceShops.reducer,
		goods: GoodsSlice.reducer,

		car: useCarSlice.reducer,
		cartSlice: cartSliceReducer.reducer
	}
});

export default store;