import styles from './CartsPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";

import { itemsSelector, totalQuantity } from '../../store/cart_slice';
import { addItemToCart, removeItemFromCart } from '../../store/cart_slice';
import { finalPrice } from '../../store/cart_slice';

const CartsPage = () => {
	const shopList = useSelector(itemsSelector);
	const Quantity = useSelector(totalQuantity);
	const total = useSelector(finalPrice);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState('');
	// console.log("name : ", name);
	// console.log("phone : ", phone);
	// console.log("email : ", email);
	// console.log("address : ", address);




	const SubmitHandler = (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const order = { name, email, phone, address, shopList };

		setError("");

		const genericErrorMessage = "Something went wrong! Please try again later.";

		fetch(
			process.env.REACT_APP_API_ENDPOINT + "goods/neworder", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				// Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(order),
		})
			.then(async (response) => {
				setIsSubmitting(false);
				if (!response.ok) {
					setError(genericErrorMessage);
					if (response.status === 400) {
						setError("Error inserting matches!");
					} else if (response.status === 401) {
						// setError("Invalid email and password combination.");
					} else {
						// setError(genericErrorMessage);
					}

					// const origin = location.state?.from?.pathname || '/';
					// navigate(origin);
				} else {
					console.log(response);
					handleSuccessMessage();

					// const data = await response.json();

					// dispatch(setToken(data.token));

					// const origin = location.state?.from?.pathname || '/';
					// navigate(origin);
				}
			})
			.catch((error) => {
				setIsSubmitting(false);
				console.log(error)
				setError(genericErrorMessage);
			});

	}


	const handleSuccessMessage = () => {
		setSuccessMessage("Congratulations! Your order has been accepted!");
		let SuccessMessage = setTimeout(() => setSuccessMessage(''), 3000);
	}



	const renderShopList = (data) => {
		if (data && data.length > 0) {
			console.log("shopList : ", data, data.length);
			return data.map(
				({ id, ...props }) => {
					console.log("data map : ", props);
					return (
						<CartItem key={id} id={id} {...props} />
					)
				})
		} else {
			return (
				<><p>Кошик порожній, наповніть його!</p></>
			)
		}
	}

	const elements = renderShopList(shopList);

	return (
		<>
			<div className={styles.body}>
				<div className={styles.userData}>
					<p>Enter your data</p>
					<label htmlFor="username">Name:</label>
					<input type="text" id="username" value={name} onChange={(e) => setName(e.target.value)} />

					<label htmlFor="useremail">Email:</label>
					<input type="email" id="useremail" value={email} onChange={(e) => setEmail(e.target.value)} />

					<label htmlFor="usertel">Phone:</label>
					<input type="tel" id="usertel" value={phone} onChange={(e) => setPhone(e.target.value)} />

					<label htmlFor="address">Address:</label>
					<input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />

				</div>
				<div className={styles.cartsList}>
					{elements}
				</div>
			</div>
			<div className={styles.footer}>
				{successMessage}
				{error}
				<p>{`Quantity: ${Quantity}__`}</p>
				<p>{`Total price: ${total}__`}</p>
				<button onClick={SubmitHandler} disabled={isSubmitting}>Submit</button>
			</div>

		</>

	);
}

export default CartsPage;


const CartItem = (props) => {
	const { id, title, price, shopName, url, quantity, totalPrice } = props;
	const dispatch = useDispatch();
	console.log(props);

	return (
		<div className={styles.cartItemWrapper}>
			<div className={styles.cartItem}>
				<img className={styles.cartImg} src="./lemonade.jpg" alt="img" />
				<p>{title}</p>
			</div>
			<div>
				<button
					className={styles.btn}
					onClick={() => dispatch(addItemToCart({ id, title, price, shopName, url }))}>+
				</button>
				<p>{quantity}</p>
				<p>{`Total: ${totalPrice}`}</p>
				<button
					className={styles.btn}
					onClick={() => dispatch(removeItemFromCart(id))}>-
				</button>
			</div>
		</div>

	)
}