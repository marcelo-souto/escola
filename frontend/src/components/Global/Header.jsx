import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
	return (
		<header className={styles.headerContainer}>
			<div className={`container ${styles.header}`}>
				<Link to=''>Logo</Link>
				<nav>
					<Link to='/login'>Login</Link>
				</nav>
			</div>
		</header>
	);
}

export default Header;
