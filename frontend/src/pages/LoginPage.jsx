import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '../components/Login/Login';
import LoginRegister from '../components/Login/LoginRegister';
import LoginResetPassword from '../components/Login/LoginResetPassword';

import styles from './LoginPage.module.css';
import EstudanteImagem from '../img/estudante2.jpg';

function LoginPage() {
	return (
		<div className={styles.container}>
			<div>
				<img
					src={EstudanteImagem}
					alt='Pessoa escrevendo em um caderno'
				/>
			</div>
			<div className={styles.formContainer}>
				<Routes>
					<Route
						path=''
						element={<Login />}
					/>
					<Route
						path='/register'
						element={<LoginRegister />}
					/>
					<Route
						path='/resetpassword'
						element={<LoginResetPassword />}
					/>
				</Routes>
			</div>
		</div>
	);
}

export default LoginPage;
