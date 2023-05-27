import { Routes, Route, NavLink, Navigate, useNavigate, useLocation, } from 'react-router-dom';

import CartsPage from './components/pages/CartsPage';
import ShopsPage from './components/pages/ShopsPage ';
import HeaderLayout from './components/HeaderLayout';
import HistoryPage from './components/pages/HistoryPage';

import './App.css';

function App() {
	return (

		<Routes>
			<Route path="/" element={<HeaderLayout />} >

				<Route index element={
					<ShopsPage />
				} />

				<Route path="/carts" element={
					<CartsPage />
				} />

				<Route path="/history" element={
					<HistoryPage />
				} />

			</Route >
		</Routes >



		// <div className="App">
		// 	<header className="App-header">
		// 		<CartsPage />
		// 		<ShopsPage />
		// 	</header>
		// </div>
	);
}

export default App;
