import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './Login.module.css';
import useForm from '../../hooks/useForm';
import { UserContext } from '../../context/UserContext';
import Input from '../Form/Input';
import Button from '../Form/Button';
import Error from '../../helpers/Error';
import { Link } from 'react-router-dom';
import { POST_RESEND_EMAIL } from '../../api/api';
import useFetch from '../../hooks/useFetch';
import Success from '../../helpers/Success';
import Head from '../../helpers/Head';

function Login() {
	const { userLogin, loading, error } = React.useContext(UserContext);
	const { request, data } = useFetch();

	const email = useForm('email');
	const senha = useForm('senha');

	const handleClick = async () => {
		const { url, options } = POST_RESEND_EMAIL({ email: email.value });
		const { response, json } = await request(url, options);
		console.log(response);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (email.validate() && senha.validate()) {
			await userLogin(email.value, senha.value);
		}
	};

	return (
		<div className={`${styles.container} comeFromRight`}>
			<Head title='Login' />
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
						type='password'
						id='senha'
						label='Senha:'
					/>
				</div>
				{error && <Error>{error}</Error>}
				{error === 'Usuário não verificado.' && !data && (
					<p className={styles.reenviar}>
						Não recebeu email de verificação?
						<span
							onClick={handleClick}
							role='button'
						>
							Clique para receber
						</span>
					</p>
				)}
				{data && <Success>{data.mensagem}</Success>}
				<Button loading={loading}>Entrar</Button>
			</Form>
			<div className={styles.cadastro}>
				<h2 className='titulo-2'>Cadastre-se</h2>
				<p>Ainda não possui conta?</p>
				<Button
					as={Link}
					to='register'
				>
					Criar Conta
				</Button>
			</div>
		</div>
	);
}

export default Login;
