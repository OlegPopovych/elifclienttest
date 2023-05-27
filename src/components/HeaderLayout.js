import styles from './Header.module.css';
import { Outlet, NavLink } from 'react-router-dom';

const HeaderLayout = () => {
	return (
		<>
			<nav className={styles.body} >
				<NavLink to={`/`}
					className={styles.navLink}
					style={({ isActive, isPending }) => {
						return {
							fontWeight: isActive ? "bold" : "",
							color: isPending ? "red" : "black",
						};
					}}
				>Shops</NavLink>
				<NavLink to={`/carts`}
					className={styles.navLink}
					style={({ isActive, isPending }) => {
						return {
							fontWeight: isActive ? "bold" : "",
							color: isPending ? "red" : "black",
						};
					}}
				>Carts</NavLink>
				<NavLink to={`/history`}
					className={styles.navLink}
					style={({ isActive, isPending }) => {
						return {
							fontWeight: isActive ? "bold" : "",
							color: isPending ? "red" : "black",
						};
					}}
				>History</NavLink>
			</nav>
			<Outlet />
		</>
	);
}

export default HeaderLayout;