import styles from './CartsPage.module.css';
import { useState, useEffect } from "react";
import { useLocalStorage } from '../../hooks/local.hook';
import useLocalStorageData from '../../hooks/local.hook';


const CartsPage = () => {
	const { onAddLocalStorageHandler, onRemoveLocalStorageHandler } = useLocalStorage();

	let reloadPageTrigger = useLocalStorageData();

	const [shopList, setShopList] = useState(useLocalStorageData());

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState('');
	const [validEmailMessage, setValidEmailMessage] = useState(false);
	const [validPhoneMessage, setValidPhoneMessage] = useState(false);

	const [requiredmessage, setRequiredmessage] = useState('');

	function getLocalStorageData() {
		return JSON.parse(localStorage.getItem('cart'));
	}

	const totalHandler = (shopList) => {
		let summ = 0;
		if (shopList && shopList.length) {
			for (let i = 0; i < shopList.length; i++) {
				summ += shopList[i].totalPrice;
			}
			return summ;
		}
		return 0;
	}

	const total = totalHandler(shopList);

	const quantityHandler = (shopList) => {
		let summ = 0;
		if (shopList && shopList.length) {
			for (let i = 0; i < shopList.length; i++) {
				summ += shopList[i].quantity;
			}
			return summ;
		}
		else return 0;
	}

	const quantity = quantityHandler(shopList);

	const onAdditemHandler = ({ id, title, price, shopName, url }) => {
		onAddLocalStorageHandler({ id, title, price, shopName, url });
		setShopList(getLocalStorageData());
	}

	const onRemoveitemHandler = ({ id }) => {
		onRemoveLocalStorageHandler({ id });
		setShopList(getLocalStorageData());
	}

	useEffect(() => {
		setShopList(getLocalStorageData());
	}, [reloadPageTrigger]);

	const clearLocalStorage = () => {
		localStorage.removeItem('cart');
		setShopList(getLocalStorageData([]));
	}

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const validatePhone = (phone) => {
		var regex = /^[\+]\d{12}$/;

		if (regex.test(phone)) {
			return true;
		} else {
			return false;
		}
	}

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
		} else {
			const valid = validateEmail(email);
			if (!valid) {
				setValidEmailMessage(true);
				let Requiredmessage = setTimeout(() => setValidEmailMessage(false), 3000);
				return;
			}
		}
		if (!phone) {
			setRequiredmessage(true);
			let Requiredmessage = setTimeout(() => setRequiredmessage(false), 3000);
			return;
		} else {
			const valid = validatePhone(phone);
			if (!valid) {
				setValidPhoneMessage(true);
				let Requiredmessage = setTimeout(() => setValidPhoneMessage(false), 3000);
				return;
			}
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
					clearLocalStorage();
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
						<CartItem key={id} id={id} {...props} onAdditemHandler={onAdditemHandler} onRemoveitemHandler={onRemoveitemHandler} />
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

					<label htmlFor="usertel">Phone in format +XXXXXXXXXXXX:</label>
					<input required type="tel" id="usertel" value={phone} onChange={(e) => setPhone(e.target.value)} />

					<label htmlFor="address">Address:</label>
					<input required type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
					{requiredmessage ? <p className={styles.warning}>Please, enter your data</p> : null}
					{validEmailMessage ? <p className={styles.warning}>Email invalid</p> : null}
					{validPhoneMessage ? <p className={styles.warning}>Phone number is invalid</p> : null}
				</div>
				<div className={styles.cartsList}>
					{elements}
				</div>
			</div>
			<footer className={styles.footer}>
				{successMessage}
				{error}
				<p className={styles.footerItem}>{`Quantity: ${quantity}`}</p>
				<p className={styles.footerItem}>{`Total price: ${total} $`}</p>
				<button type="submit" onClick={SubmitHandler} disabled={isSubmitting}>Submit</button>
			</footer>
		</div>

	);
}
export default CartsPage;

const CartItem = (props) => {
	const { id, title, price, shopName, url, quantity, totalPrice, onRemoveitemHandler, onAdditemHandler } = props;

	return (
		<div className={styles.cartItemWrapper}>
			<div className={styles.cartItem}>
				<img className={styles.cartImg} src={`${process.env.REACT_APP_API_ENDPOINT}images/${url}.jpg`} alt="img" />
				<p>{title}</p>
			</div>
			<div>
				<button
					className={styles.btn}
					onClick={() => onAdditemHandler({ id, title, price, shopName, url })}>+
				</button>
				<p>{quantity}</p>
				<p>{`Total: ${totalPrice} $`}</p>
				<button
					className={styles.btn}
					onClick={() => onRemoveitemHandler({ id })}>-
				</button>
			</div>
		</div>
	)
}