import React from 'react';
import Modal from './../Modal';
import Input from '../Form/Input';
import Button from '../Form/Button';
import useForm from '../../hooks/useForm';
import InputMask from 'react-input-mask';
import styles from './ProfessorForm.module.css';
import useFetch from '../../hooks/useFetch';
import InputSelect from '../Form/InputSelect';
import {
	GET_MATERIAS,
	POST_CREATE_PROFESSOR,
	POST_UPDATE_PROFESSOR
} from '../../api/api';
import Error from '../../helpers/Error';
import Aviso from '../../helpers/Aviso';
import Success from '../../helpers/Success';

function ProfessorForm({ data, showModal, setShowModal, setReload, reload }) {
	const update = data ? true : false;

	const { request, error, data: json, loading } = useFetch();
	const [materias, setMaterias] = React.useState(null);

	const nome = useForm();
	const dataNascimento = useForm('data');
	const cpf = useForm('cpf');
	const telefone = useForm('telefone');
	const email = useForm('email');
	const materia = useForm();

	React.useEffect(() => {
		const getData = async () => {
			const { url, options } = GET_MATERIAS();

			const response = await fetch(url, options);
			const json = await response.json();

			if (response.ok && json) {
				setMaterias(
					json.map((materia) => {
						return { option: materia.nome, value: materia.materiaId };
					})
				);
			}
		};

		getData();
	}, []);

	React.useEffect(() => {
		if (data) {
			nome.setValue(data.nome ? data.nome : '');
			dataNascimento.setValue(data.dataNascimento ? data.dataNascimento : '');
			cpf.setValue(data.cpf ? data.cpf : '');
			telefone.setValue(data.telefone ? data.telefone : '');
			email.setValue(data.email ? data.email : '');
			materia.setValue(data.materia ? data.materia.materiaId : '');
		}
	}, [data]);

	React.useEffect(() => {
		let interval;

		if (json) {
			interval = setInterval(() => {
				setShowModal(false);
				setReload(!reload)
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [json]);

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			nome.validate() &&
			dataNascimento.validate() &&
			cpf.validate() &&
			telefone.validate() &&
			email.validate() &&
			materia.validate()
		) {
			let cadastro = {
				nome: nome.value,
				dataNascimento: dataNascimento.value,
				cpf: cpf.value.replaceAll(/(-|\.)/g, ''),
				telefone: telefone.value.replaceAll(/(\s|-)/g, ''),
				email: email.value,
				materiaId: materia.value
			};

			if (update) {
				cadastro = Object.entries(cadastro)
					.filter((item) => data[item[0]] !== item[1])
					.reduce((prev, curr) => {
						return { ...prev, [curr[0]]: curr[1] };
					}, {});

				const { url, options } = POST_UPDATE_PROFESSOR({
					...cadastro,
					professorId: data.professorId,
					materiaId: data.materia.materiaId !== materia.value && materia.value
				});

				await request(url, options);
			} else {
				const { url, options } = POST_CREATE_PROFESSOR(cadastro);

				await request(url, options);
			}
		}
	};

	if (!showModal) return null;
	return (
		<>
			{json ? (
				<Aviso>
					<Success>{json.mensagem}</Success>
				</Aviso>
			) : (
				<Modal>
					<h2 className='titulo-3'>Cadastro</h2>
					<form
						onSubmit={handleSubmit}
						className={styles.form}
					>
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
						{materias && (
							<InputSelect
								{...materia}
								options={materias}
								defaultOption='Selecione uma matéria'
								label='Matéria:'
							/>
						)}
						<div className={styles.botoes}>
							{error && <Error>{error}</Error>}
							<div>
								<Button loading={loading}>Enviar</Button>
								<Button
									onClick={handleCancel}
									variant='secondary'
								>
									Cancelar
								</Button>
							</div>
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}

export default ProfessorForm;
