import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { UserContext } from '../../context/UserContext';
import { ReactComponent as LogoImage } from '../../img/layers.svg';
import { ReactComponent as Seta } from '../../img/arrow.svg';
import { ReactComponent as Sair } from '../../img/sair.svg';
import Button from '../Form/Button';

function Header() {
	const { user, loggedIn, userLogout } = React.useContext(UserContext);
	const [menu, setMenu] = React.useState(false);

	const location = useLocation();

	React.useEffect(() => {
		setMenu(false);
	}, [location.pathname]);

	const handleClick = () => {
		setMenu(!menu);
	};

	return (
		<header className={styles.headerContainer}>
			<div className={styles.header}>
				<Link to='login'>
					<LogoImage width='28' />
				</Link>
				<nav>
					{loggedIn && user && !location.pathname.includes('dashboard') && (
						<Link
							to='/dashboard'
							end
							className={styles.user}
						>
							<div className={styles.icon}>{user.nome[0]}</div>
							<p className={styles.nome}>
								<span>Olá</span>
								{user.nome}
							</p>
						</Link>
					)}
					{loggedIn && user && location.pathname.includes('dashboard') && (
						<div
							role='button'
							onClick={handleClick}
							className={styles.user}
						>
							<div className={styles.icon}>{user.nome[0]}</div>
							<p className={styles.nome}>
								<span>Olá</span>
								{user.nome}
							</p>
							<Seta
								style={{
									transition: 'all ease-in-out .3s',
									transform: menu ? 'rotate(180deg)' : 'initial'
								}}
							/>
						</div>
					)}
					{!loggedIn && (
						<Link to='/login'>
							<Button variant='outline-primary'>Login</Button>
						</Link>
					)}
					{loggedIn && menu && location.pathname.includes('dashboard') && (
						<div
							className={styles.headerMenu}
							role='button'
							onClick={userLogout}
						>
							<p>Sair</p>
							<Sair />
						</div>
					)}
				</nav>
			</div>
		</header>
	);
}

export default Header;
