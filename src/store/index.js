import { configureStore } from "@reduxjs/toolkit";

import SliceShops from "./shops_slice";
import GoodsSlice from "./goods_slice";
import historySlice from "./history_slice";

const store = configureStore({
	reducer: {
		shops: SliceShops.reducer,
		goods: GoodsSlice.reducer,
		history: historySlice.reducer,
	}
});

export default store;