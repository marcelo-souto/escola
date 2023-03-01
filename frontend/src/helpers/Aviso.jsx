import React from 'react';
import styles from './Aviso.module.css';

function Aviso({ children }) {
	return <div className={styles.aviso}>{children}</div>;
}

export default Aviso;
