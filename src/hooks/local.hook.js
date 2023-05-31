import { useEffect, useState } from "react";

export const useLocalStorage = () => {

	const onAddLocalStorageHandler = ({ id, title, price, shopName, url }) => {
		const carts = localStorage.getItem('cart');
		let parsedCarts = [];
		let indexCart = -1;

		if (carts) {
			parsedCarts = JSON.parse(carts);
			indexCart = parsedCarts.findIndex((item) => item.id === id);
		}

		if (indexCart !== -1) {
			parsedCarts[indexCart].quantity += 1;
			parsedCarts[indexCart].totalPrice = price * parsedCarts[indexCart].quantity;
			const newLocalStorage = JSON.stringify(parsedCarts)
			localStorage.setItem('cart', newLocalStorage);
		} else {
			const newCart = {
				id: id,
				title: title,
				price: price,
				shopName: shopName,
				url: url,
				quantity: 1,
				totalPrice: price,
			}
			const newStorage = [...parsedCarts, newCart]
			const newLocalStorage = JSON.stringify(newStorage)
			localStorage.setItem('cart', newLocalStorage);

		}
	}

	const onRemoveLocalStorageHandler = ({ id }) => {
		const carts = localStorage.getItem('cart');
		let parsedCarts = JSON.parse(carts);

		const indexCart = parsedCarts.findIndex((item) => item.id === id);
		const quantityItems = parsedCarts[indexCart].quantity;

		if (quantityItems > 1) {
			parsedCarts[indexCart].quantity -= 1;
			parsedCarts[indexCart].totalPrice = parsedCarts[indexCart].price * parsedCarts[indexCart].quantity;
		}
		else {
			parsedCarts.splice(indexCart, 1);
		}

		const newLocalStorage = JSON.stringify(parsedCarts);
		localStorage.setItem('cart', newLocalStorage);
	}

	return {
		onAddLocalStorageHandler,
		onRemoveLocalStorageHandler
	}
}

function getLocalStorageData() {
	const data = JSON.parse(localStorage.getItem('cart'));
	if (data) {
		return JSON.parse(localStorage.getItem('cart'));
	} else {
		return [];
	}
}

export default function useLocalStorageData() {
	const [data, setData] = useState(getLocalStorageData());

	useEffect(() => {
		function handleChangeStorage() {
			setData(getLocalStorageData());
		}

		window.addEventListener('storage', handleChangeStorage);
		return () => window.removeEventListener('storage', handleChangeStorage);
	}, []);

	return data;
}