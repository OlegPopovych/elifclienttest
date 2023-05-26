import styles from './Header.module.css';
import { Routes, Route, Outlet, Link, NavLink, useParams, useNavigate, useSearchParams, } from 'react-router-dom';


const HeaderLayout = () => {
	return (
		<>
			<nav className={styles.body}>
				<NavLink to={`/`} className={styles.navLink}>Shops</NavLink>
				<NavLink to={`/carts`} className={styles.navLink}>Carts</NavLink>
			</nav>
			<Outlet />
		</>

	);
}

export default HeaderLayout;