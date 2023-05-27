import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
	items: [],
	totalQuantity: 0
};

const cartSlice = createSlice({
	name: 'cartSlice',
	initialState,
	reducers: {
		addItemToCart: (state, action) => {
			const indexCart = state.items.findIndex((item) => item.id === action.payload.id);

			if (indexCart !== -1) {
				state.items[indexCart].quantity += 1;
				state.items[indexCart].totalPrice = action.payload.price * state.items[indexCart].quantity;
				state.totalQuantity += 1;
			}
			else {
				const newCart = {
					id: action.payload.id,
					title: action.payload.title,
					price: action.payload.price,
					shopName: action.payload.shopName,
					url: action.payload.url,
					quantity: 1,
					totalPrice: action.payload.price,
				}
				state.items = [...state.items, newCart];
				state.totalQuantity += 1;
			}
		},
		removeItemFromCart: (state, action) => {
			const indexCart = state.items.findIndex((item) => item.id === action.payload);
			const quantityItems = state.items[indexCart].quantity;
			if (quantityItems > 1) {
				state.items[indexCart].quantity -= 1;
				state.items[indexCart].totalPrice = state.items[indexCart].price * state.items[indexCart].quantity;
				state.totalQuantity -= 1;
			}
			else {
				state.items.splice(indexCart, 1);
				state.totalQuantity -= 1;
			}
		},
	}
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;
export const itemsSelector = state => state.cartSlice.items;
export const totalQuantity = state => state.cartSlice.totalQuantity;

export const finalPrice = createSelector(
	(state) => state.cartSlice.items,
	(items) => {
		console.log('items: ', items);
		let summ = 0;
		for (let i = 0; i < items.length; i++) {
			console.log('items.finalPrice: ', items[i].totalPrice);
			summ += items[i].totalPrice;
		}
		return summ;
	}
)

export const cartActions = cartSlice.actions;

export default cartSlice;

