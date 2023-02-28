import React from 'react';
import styles from './LoginRegister.module.css';
import { Form } from 'react-bootstrap';
import Input from '../Form/Input';
import useForm from '../../hooks/useForm';
import Button from '../Form/Button';
import { IMaskInput } from 'react-imask';

// nome, cpf, dataNascimento, telefone, email, senha

function LoginRegister() {
	const nome = useForm();
	const dataNascimento = useForm();
  const cpfRef = React.forwardRef()
	const telRef = React.forwardRef()
	const email = useForm('email');
	const senha = useForm('senha');

	return (
		<div>
			<Form>
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
				<Input
					label='CPF:'
					id='cpf'
          ref={cpfRef}
          as={IMaskInput}
          mask='000.000.000-00'
					placeholder='000.000.000-00'
				/>
				<div className={styles.inputContainer}>
					<Input
						label='Telefone:'
						id='telefone'
            ref={telRef}
            as={IMaskInput}
            mask='00 00000-0000'
            placeholder='00 00000-0000'
					/>
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
				<Button>Enviar</Button>
			</Form>
		</div>
	);
}

export default LoginRegister;
