import React from 'react';
import styles from './Footer.module.css';

function Footer() {
	return (
		<footer className={`${styles.footer}`}>
			<div className='container'>
			© {new Date().getFullYear()}. Alguns direitos reservados.
			</div>
		</footer>
	);
}

export default Footer;
