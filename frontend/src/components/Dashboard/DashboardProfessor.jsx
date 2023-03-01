import React from 'react';
import styles from './DashboardProfessor.module.css';
import Button from '../Form/Button';
import useFetch from '../../hooks/useFetch';
import {
	GET_PROFESSORES_BY_DIRETOR,
	DELETE_DELETE_PROFESSOR
} from '../../api/api';
import ProfessoresLista from './ProfessoresLista';
import ProfessorForm from './ProfessorForm';
import Loading from '../../helpers/Loading';

function DashboardProfessor() {
	const { loading, data, error, request } = useFetch();
	const [showModal, setShowModal] = React.useState(false);
	const [professor, setProfessor] = React.useState(null);
	const [reload, setReload] = React.useState(false);

	React.useEffect(() => {
		const getData = async () => {
			const { url, options } = GET_PROFESSORES_BY_DIRETOR();
			await request(url, options);
		};

		getData();
	}, [reload]);

	const handleCreateNew = () => {
		setProfessor(null);
		setShowModal(true);
	};

	const handleEdit = ({ target }) => {
		const id = target.parentElement.getAttribute('data-id');

		const professor =
			id &&
			data &&
			data.professores.find((professor) => professor.professorId == id);

		if (professor) setProfessor(professor);

		setShowModal(true);
	};

	const handleDelete = async ({ target }) => {
		const id = target.parentElement.getAttribute('data-id');

		if (id) {
			const { url, options } = DELETE_DELETE_PROFESSOR(id);
			const response = await fetch(url, options);
			const json = await response.json()

			if(response.ok) setReload(!reload)
		}
	};

	if (loading) return <Loading />;
	return (
		<section className={styles.container}>
			<h1 className={`${styles.title} comeFromRight`}>Professores</h1>
			<div className={`${styles.lista} comeFromRight`}>
				<div>
					<Button onClick={handleCreateNew}>Novo Cadastro</Button>
				</div>
				{data && data.professores && (
					<ProfessoresLista
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						data={data.professores}
					/>
				)}
			</div>
			{showModal && (
				<ProfessorForm
					setReload={setReload}
					reload={reload}
					data={professor}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</section>
	);
}

export default DashboardProfessor;
