import styles from './HistoryPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";

import { historySelectors } from '../../store/history_slice';
import { fetchHistory } from '../../store/history_slice';


const HistoryPage = () => {
	const { historyLoadingStatus } = useSelector(state => state.history);
	const historyList = useSelector(historySelectors.selectAll);
	const dispatch = useDispatch();

	const [filter, setFilter] = useState('');

	useEffect(() => {
		dispatch(fetchHistory());
	}, []);

	const listFilter = (list, number) => {
		const newList = list.filter((item) => item.phone == number);
		return newList;
	}

	const renderHistory = (data, status, filter) => {
		if (status === "loading") {
			return <div>Loading elements</div>
		} else if (status === "error") {
			return <div>Error loading</div>
		} else if (data.length < 1) {
			return <div>There are no orders yet</div>
		}

		if (data && data.length > 0) {
			if (filter) {
				const filteredList = listFilter(data, filter);
				return filteredList.map(
					({ _id, ...props }) => {
						return (
							<HistoryItem key={_id} id={_id} {...props} />
						)
					})
			}
			return data.map(
				({ _id, ...props }) => {
					return (
						<HistoryItem key={_id} id={_id} {...props} />
					)
				})
		}
	}

	const elements = renderHistory(historyList, historyLoadingStatus, filter);

	return (
		<div className={styles.body}>
			<div className={styles.historyMenu}>
				<label htmlFor="address">Enter your phone number:</label>
				<input required type="text" id="address" value={filter} onChange={(e) => setFilter(e.target.value)} />
			</div>
			{elements}
		</div>
	);
}

export default HistoryPage;

const HistoryItem = ({ address, total, create_date, email, id, name, phone, shopList }) => {

	const renderitems = (data, status) => {
		if (status === "loading") {
			return <div>Loading elements</div>
		} else if (status === "error") {
			return <div>Error loading</div>
		}
		if (data && data.length > 0) {
			return data.map(
				({ id, ...props }) => {
					return (
						<GoodsItem key={id} id={id} {...props} />
					)
				})
		}
	}

	const elements = renderitems(shopList);

	const create_dateNew = new Date(create_date);
	const date = `${create_dateNew.getDate()}/0${create_dateNew.getMonth() + 1}/${create_dateNew.getFullYear()} ${create_dateNew.getHours()}:${create_dateNew.getMinutes()}`;

	return (
		<div className={styles.historyItem}>
			<div className={styles.userData}>
				<p className={styles.text}>{`Client: ${name}`}</p>
				<p className={styles.text}>{`Date: ${date}`}</p>
				<p className={styles.text}>{`Phone: ${phone}`}</p>
				<p className={styles.text}>{`Email: ${email}`}</p>
				<p className={styles.text}>{`Address: ${address}`}</p>
				<p className={styles.text}>{`Total: ${total} $`}</p>
			</div>
			<div className={styles.goodsItemsBody}>
				{elements}
			</div>
		</div>
	)
}

const GoodsItem = ({ price, totalPrice, title, url, shopName, quantity }) => {
	return (
		<div className={styles.goodsItem}>
			<img className={styles.itemImg} src={`${process.env.REACT_APP_API_ENDPOINT}images/${url}.jpg`} alt="img" />
			<div className={styles.itemDescriprion}>
				<p className={styles.text}>{`Title: ${title}`}</p>
				<p className={styles.text}>{`Quantity: ${quantity}`}</p>
				<p className={styles.text}>{`Price: ${price} $`}</p>
				<p className={styles.text}>{`Total Price: ${totalPrice} $`}</p>
				<p className={styles.text}>{`Shop name: ${shopName.toUpperCase()}`}</p>
			</div>

		</div>
	)
}