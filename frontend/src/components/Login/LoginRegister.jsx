import React from 'react';
import styles from './LoginRegister.module.css';
import { Form } from 'react-bootstrap';
import Input from '../Form/Input';
import useForm from '../../hooks/useForm';
import Button from '../Form/Button';
import { POST_CREATE_DIRETOR } from '../../api/api';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import Error from '../../helpers/Error';
import InputMask from 'react-input-mask';

// nome, cpf, dataNascimento, telefone, email, senha

function LoginRegister() {
	const { data, loading, error, request } = useFetch();

	const navigate = useNavigate();

	const nome = useForm();
	const dataNascimento = useForm('data');
	const cpf = useForm('cpf');
	const telefone = useForm('telefone');
	const email = useForm('email');
	const senha = useForm('senha');

	async function handleSubmit(e) {
		e.preventDefault();

		if (
			nome.validate() &&
			cpf.validate() &&
			telefone.validate() &&
			email.validate() &&
			senha.validate() &&
			dataNascimento.validate()
		) {
			const { url, options } = POST_CREATE_DIRETOR({
				nome: nome.value,
				email: email.value,
				senha: senha.value,
				telefone: telefone.value.replaceAll(/(\s|-)/g, ''),
				cpf: cpf.value.replaceAll(/(-|\.)/g, ''),
				dataNascimento: dataNascimento.value
			});

			const { json, response } = await request(url, options);

			if (response.ok) navigate('/login');
		}
	}

	return (
		<div className='comeFromRight'>
			<h1 className='titulo'>Cadastre-se</h1>
			<Form onSubmit={handleSubmit}>
				<Input
					label='Nome:'
					id='nome'
					{...nome}
				/>
				<Input
					label='Email:'
					id='email'
					{...email}
					placeholder='seuemail@email.com'
				/>
				<InputMask
					mask='999.999.999-99'
					value={cpf.value}
					onChange={cpf.onChange}
					onBlur={cpf.onBlur}
				>
					<Input
						label='CPF:'
						id='cpf'
						error={cpf.error}
						placeholder='000.000.000-00'
					/>
				</InputMask>
				<div className={styles.inputContainer}>
					<InputMask
						mask='99 99999-9999'
						value={telefone.value}
						onChange={telefone.onChange}
						onBlur={telefone.onBlur}
					>
						<Input
							label='Telefone:'
							id='telefone'
							error={telefone.error}
							placeholder='00 00000-0000'
						/>
					</InputMask>
					<Input
						label='Data de nascimento:'
						id='dataNascimento'
						{...dataNascimento}
						max='2005-01-01'
						type='date'
					/>
				</div>
				<Input
					label='senha:'
					id='senha'
					type='password'
					{...senha}
				/>
				{error && <Error>{error}</Error>}
				<Button loading={loading}>Enviar</Button>
			</Form>
		</div>
	);
}

export default LoginRegister;
