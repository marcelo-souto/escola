import React from 'react';
import Input from '../Form/Input';
import useForm from '../../hooks/useForm';
import { Form } from 'react-bootstrap';
import Button from '../Form/Button';
import useFetch from '../../hooks/useFetch';
import { POST_RESET_PASSWORD } from '../../api/api';
import Error from '../../helpers/Error';
import Success from '../../helpers/Success';
import { useNavigate } from 'react-router-dom';
import Head from '../../helpers/Head';

function LoginResetPassword() {
	const { loading, data, error, request } = useFetch();

	const navigate = useNavigate();

	const email = useForm('email');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const getData = async () => {
			const { url, options } = POST_RESET_PASSWORD({ email: email.value });
			const { json, response } = await request(url, options);
		};

		if (email.validate()) {
			await getData();
		}
	};

	return (
		<div className='comeFromRight'>
			<Head title='Esqueci minha senha' />
			<h1 className='titulo'>Esqueceu sua senha?</h1>
			<Form onSubmit={handleSubmit}>
				<Input
					label='Insira seu email de recuparação:'
					id='email'
					placeholder='usuario@email.com'
					{...email}
				/>
				{error && <Error>{error}</Error>}
				{data && <Success>{data.message}</Success>}
				{data ? (
					<Button
						variant='secondary'
						onClick={() => navigate('/login')}
					>
						Voltar
					</Button>
				) : (
					<Button loading={loading}>Enviar</Button>
				)}
			</Form>
		</div>
	);
}

export default LoginResetPassword;
