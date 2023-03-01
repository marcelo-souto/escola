import React from 'react';
import styles from './Modal.module.css';

function Modal({ children, onClick }) {
	return (
		<div className={styles.background} onClick={onClick}>
			<div className={styles.modal}>{children}</div>
		</div>
	);
}

export default Modal;
