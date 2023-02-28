import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './Login.module.css';
import useForm from '../../hooks/useForm';
import { UserContext } from '../../context/UserContext';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../../helpers/Error';
import { Link } from 'react-router-dom';

function Login() {
	const { userLogin, loading, error } = React.useContext(UserContext);

	const email = useForm('email');
	const senha = useForm('senha');

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (email.validate() && senha.validate()) {
			await userLogin(email.value, senha.value);
		}
	};

	return (
		<div className={`${styles.container} comeFromRight`}>
			<h1 className='titulo'>Login</h1>
			<Form onSubmit={handleSubmit}>
				<Input
					{...email}
					id='email'
					label='Email:'
				/>
				<div className={styles.esquecisenhaContainer}>
					<Link
						className={styles.esquecisenha}
						to='/login/resetpassword'
					>
						Esqueceu sua senha?
					</Link>
					<Input
						{...senha}
						id='senha'
						label='Senha:'
					/>
				</div>
				{error && <Error>{error}</Error>}
				<Button loading={loading}>Entrar</Button>
			</Form>
		</div>
	);
}

export default Login;
