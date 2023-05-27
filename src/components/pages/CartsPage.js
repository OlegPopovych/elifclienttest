import styles from './CartsPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";

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

	const [requiredmessage, setRequiredmessage] = useState('');

	const SubmitHandler = (e) => {
		e.preventDefault();
		if (!total) {
			alert("Корзина пуста, виберіть товар");
			return;
		}
		if (!name) {
			setRequiredmessage(true);
			let Requiredmessage = setTimeout(() => setRequiredmessage(false), 3000);
			return;
		}
		if (!email) {
			setRequiredmessage(true);
			let Requiredmessage = setTimeout(() => setRequiredmessage(false), 3000);
			return;
		}
		if (!phone) {
			setRequiredmessage(true);
			let Requiredmessage = setTimeout(() => setRequiredmessage(false), 3000);
			return;
		}
		if (!address) {
			setRequiredmessage(true);
			let Requiredmessage = setTimeout(() => setRequiredmessage(false), 3000);
			return;
		}

		setIsSubmitting(true);

		const order = { name, email, phone, total, address, shopList };

		setError("");

		const genericErrorMessage = "Something went wrong! Please try again later.";

		fetch(
			process.env.REACT_APP_API_ENDPOINT + "goods/neworder", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then(async (response) => {
				setIsSubmitting(false);
				if (!response.ok) {
					setError(genericErrorMessage);
					if (response.status === 400) {
						setError("Error inserting matches!");
					}
				} else {
					handleSuccessMessage();
				}
			})
			.catch((error) => {
				setIsSubmitting(false);
				setError(genericErrorMessage);
			});
	}

	const handleSuccessMessage = () => {
		setSuccessMessage("Congratulations! Your order has been accepted!");
		let SuccessMessage = setTimeout(() => setSuccessMessage(''), 3000);
	}

	const renderShopList = (data) => {
		if (data && data.length > 0) {
			return data.map(
				({ id, ...props }) => {
					return (
						<CartItem key={id} id={id} {...props} />
					)
				})
		} else {
			return (
				<p>The basket is empty, fill it!</p>
			)
		}
	}

	const elements = renderShopList(shopList);

	return (
		<div >
			<div className={styles.body}>
				<div className={styles.userData}>
					<p>Enter your data</p>
					<label htmlFor="username">Name:</label>
					<input required type="text" id="username" value={name} onChange={(e) => setName(e.target.value)} />

					<label htmlFor="useremail">Email:</label>
					<input required type="email" id="useremail" value={email} onChange={(e) => setEmail(e.target.value)} />

					<label htmlFor="usertel">Phone:</label>
					<input required type="tel" id="usertel" value={phone} onChange={(e) => setPhone(e.target.value)} />

					<label htmlFor="address">Address:</label>
					<input required type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
					{requiredmessage ? <p className={styles.warning}>Please, enter your name</p> : null}
				</div>
				<div className={styles.cartsList}>
					{elements}
				</div>
			</div>
			<footer className={styles.footer}>
				{successMessage}
				{error}
				<p className={styles.footerItem}>{`Quantity: ${Quantity}`}</p>
				<p className={styles.footerItem}>{`Total price: ${total} $`}</p>
				<button type="submit" onClick={SubmitHandler} disabled={isSubmitting}>Submit</button>
			</footer>
		</div>

	);
}
export default CartsPage;

const CartItem = (props) => {
	const { id, title, price, shopName, url, quantity, totalPrice } = props;
	const dispatch = useDispatch();

	return (
		<div className={styles.cartItemWrapper}>
			<div className={styles.cartItem}>
				<img className={styles.cartImg} src={`${process.env.REACT_APP_API_ENDPOINT}images/${url}.jpg`} alt="img" />
				<p>{title}</p>
			</div>
			<div>
				<button
					className={styles.btn}
					onClick={() => dispatch(addItemToCart({ id, title, price, shopName, url }))}>+
				</button>
				<p>{quantity}</p>
				<p>{`Total: ${totalPrice} $`}</p>
				<button
					className={styles.btn}
					onClick={() => dispatch(removeItemFromCart(id))}>-
				</button>
			</div>
		</div>

	)
}