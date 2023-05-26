import styles from './Header.module.css';
import { Routes, Route, Outlet, Link, NavLink, useParams, useNavigate, useSearchParams, } from 'react-router-dom';


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
			</nav>
			<Outlet />
		</>

	);
}

export default HeaderLayout;