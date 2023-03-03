import React from 'react';
import styles from './PageNotFound.module.css';
import Head from '../helpers/Head';

function PageNotFound() {
	return (
		<section className={styles.container}>
			<Head title='Página não encontrada' />
			<div>
				<p className={styles.mensagem}>Página não encontrada</p>
			</div>
		</section>
	);
}

export default PageNotFound;
