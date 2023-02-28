import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { UserContext } from '../../context/UserContext'

function Header() {

	const { user, loggedIn } = React.useContext(UserContext)

	return (
		<header className={styles.headerContainer}>
			<div className={`container ${styles.header}`}>
				<Link to=''>Logo</Link>
				<nav>
					{loggedIn ? <Link to='/dashboard'>Olá, {user.nome}</Link> : <Link to='/login'>Login</Link>}
				</nav>
			</div>
		</header>
	);
}

export default Header;
