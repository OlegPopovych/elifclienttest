import styles from './ShopsPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from "react";

import { globalizedSelectors } from '../../store/shops_slice';
import { fetchShops } from '../../store/shops_slice';
import { fetchGoods } from '../../store/goods_slice';
import { goodsSelector } from '../../store/goods_slice';
import { addItemToCart } from '../../store/cart_slice';
import { itemsSelector} from '../../store/cart_slice';

const ShopsPage = () => {
	const { shopsLoadingStatus } = useSelector(state => state.shops);
	const shopList = useSelector(globalizedSelectors.selectAll);
	const dispatch = useDispatch();

	const [selectedShop, setSelectedShop] = useState('');

	useEffect(() => {
		dispatch(fetchShops());
	}, []);

	const onsetSelectedShop = (data) => {
		setSelectedShop(data.toLowerCase());
	}

	const renderShops = useCallback((data, status) => {
		if (status === "loading") {
			return <div>Loading elements</div>
		} else if (status === "error") {
			return <div>Error loading</div>
		}
		if (data && data.length > 0) {
			return data.map(
				({ _id, ...props }) => {
					return (
						<ShopsItem key={_id} {...props} onsetSelectedShop={onsetSelectedShop} />
					)
				})
		}
	}, [shopList, shopsLoadingStatus]);

	const elements = renderShops(shopList, shopsLoadingStatus);

	return (
		<div className={styles.body}>
			<div className={styles.shopsMenu}>
				{elements}
			</div>
			<GoodsList shopName={selectedShop} />
		</div>
	);
}

export default ShopsPage;

const ShopsItem = ({ name, onsetSelectedShop }) => {
	return (
		<div className={styles.shopsItem} onClick={() => onsetSelectedShop(name)}>
			<p>{name}</p>
		</div>
	)
}

const GoodsList = ({ shopName }) => {
	const { goodsLoadingStatus } = useSelector(state => state.goods);
	const goodsList = useSelector(goodsSelector.selectAll);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchGoods(shopName));
	}, [shopName]);

	const renderGoods = (data, status) => {
		if (status === "loading") {
			return <div>Loading elements</div>
		} else if (status === "error") {
			return <div>Error loading</div>
		}
		if (data && data.length > 0) {
			return data.map(
				({ _id, ...props }) => {
					return (
						<GoodsItem key={_id} id={_id} {...props} />
					)
				})
		}
	}

	const elements = renderGoods(goodsList, goodsLoadingStatus);

	return (
		<div className={styles.cartsList}>
			{elements}
		</div>
	)
}


const GoodsItem = ({ id, title, price, shopName, url }) => {
	const selectedGoods = useSelector(itemsSelector);
	const dispatch = useDispatch();

	const onAddItemToCart = (props) => {
		if (selectedGoods.length > 0 && selectedGoods[0].shopName.toLowerCase() !== shopName.toLowerCase()) {
			alert('You cannot choose a product while the ordered products are present from another store! Please clear the order.');
			return;
		}
		dispatch(addItemToCart(props));
	}
	return (
		<div className={styles.cartItem}>
			<img className={styles.cartImg} src={`${process.env.REACT_APP_API_ENDPOINT}images/${url}.jpg`} alt="img" />
			<p className={styles.title}>{`${title}`}</p>
			<p>{`Price: ${price} $`}</p>
			<button onClick={() => onAddItemToCart({ id, title, price, shopName, url })}
			>Add to Cart</button>
		</div>
	)
}
